"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BuildContractProvider, useBuildContract, type GeneratedPayment, type Team } from "@/lib/build-contract-context"
import { BuildReviewStage } from "@/components/contracts2/build-review-stage"
import { BuildExportStage } from "@/components/contracts2/build-export-stage"
import type { ContractWithDetails } from "@/lib/contract-types"
import { updateContract, deleteContract, createContract } from "@/lib/contract-actions"
import { getBudgetPeriodsForSport } from "@/lib/budget-actions"
import type { CreateContractInput, CreatePaymentInput, CreateCapAllocationInput, CreateConditionalPaymentInput } from "@/lib/contract-types"

interface EditAgreementClientProps {
  contract: ContractWithDetails
}

// Inner component that uses the context
function EditAgreementInner({ contract }: EditAgreementClientProps) {
  const router = useRouter()
  const { state, setStage, setFormData, setPayments, setConditionalPayments, setEditingContractId } = useBuildContract()
  const [initialized, setInitialized] = useState(false)
  const [saving, setSaving] = useState(false)

  // Initialize the context with the contract data
  useEffect(() => {
    if (!initialized) {
      // Map team from DB format to context format
      const team: Team = contract.team === "MBB" ? "mens-basketball" : "womens-basketball"

      // Convert payments to GeneratedPayment format
      const payments: GeneratedPayment[] = contract.payments.map((p, index) => ({
        id: `payment-${index + 1}`,
        date: p.payment_date,
        amount: p.amount,
        type: "Scheduled Payment",
        capPeriod: p.cap_period || "",
        fiscalYear: p.fiscal_year || "",
        capApplicable: p.cap_applicable !== false,
        edited: false,
      }))

      // Load cap periods from existing cap_allocations first, then fall back to payment calculation
      let capPeriods: { id: string; label: string; startDate: string; endDate: string; amount: number; percentage: number; locked: boolean }[] = []
      
      if (contract.cap_allocations && contract.cap_allocations.length > 0) {
        // Use existing cap allocations from database
        // We need to get the fiscal_year_label for each allocation
        const capPeriodMap: Record<string, number> = {}
        for (const alloc of contract.cap_allocations) {
          // The budget_period_id maps to a fiscal_year_label
          // We'll use the cap_period from payments to get labels, or fetch them
          const label = alloc.budget_period_id // temporary - we'll fix this below
          capPeriodMap[label] = (capPeriodMap[label] || 0) + alloc.allocated_amount
        }
        
        // For now, also check payments for cap period labels
        const labelMap: Record<string, string> = {}
        for (const p of payments) {
          if (p.capPeriod) {
            labelMap[p.capPeriod] = p.capPeriod
          }
        }
        
        capPeriods = Object.entries(capPeriodMap).map(([id, amount], index) => ({
          id: `cap-${index + 1}`,
          label: labelMap[id] || id, // Use payment label if available
          startDate: "",
          endDate: "",
          amount,
          percentage: contract.total_value > 0 ? (amount / contract.total_value) * 100 : 0,
          locked: false,
        }))
      } else {
        // Fall back to calculating from payments
        const capPeriodMap: Record<string, number> = {}
        for (const p of payments) {
          if (p.capPeriod) {
            capPeriodMap[p.capPeriod] = (capPeriodMap[p.capPeriod] || 0) + p.amount
          }
        }

        capPeriods = Object.entries(capPeriodMap).map(([label, amount], index) => ({
          id: `cap-${index + 1}`,
          label,
          startDate: "",
          endDate: "",
          amount,
          percentage: contract.total_value > 0 ? (amount / contract.total_value) * 100 : 0,
          locked: false,
        }))
      }

      // Set form data
      setFormData({
        contractType: "revenue-share",
        athleteName: contract.athlete_name,
        counterpartyName: contract.counterparty_name,
        team,
        startDate: contract.start_date,
        endDate: contract.end_date,
        totalValue: contract.total_value,
        paymentFrequency: contract.payment_frequency as "bi-weekly" | "monthly" | "quarterly",
        capPeriods,
      })

      // Set payments
      setPayments(payments)

      // Convert conditional payments to GeneratedPayment format
      const conditionalPayments: GeneratedPayment[] = (contract.conditional_payments || []).map((p, index) => ({
        id: `conditional-${index + 1}`,
        date: p.payment_date,
        amount: p.amount,
        type: p.payment_type,
        capPeriod: p.cap_period || "",
        fiscalYear: "",
        capApplicable: true,
        edited: false,
      }))

      // Set conditional payments
      setConditionalPayments(conditionalPayments)

      // Set the editing contract ID so we can exclude it from agreement payment sums
      setEditingContractId(contract.id)

      // Set stage to review
      setStage("review")
      setInitialized(true)
    }
  }, [contract, initialized, setFormData, setPayments, setConditionalPayments, setEditingContractId, setStage])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Map team to database format
      const teamCode = state.formData.team === "mens-basketball" ? "MBB" : "WBB"
      
      // Get budget periods to map payment dates to budget period IDs
      const budgetPeriods = await getBudgetPeriodsForSport(teamCode, "REVENUE_SHARE")
      
      // Helper function to find budget period for a payment date
      const findBudgetPeriodForDate = (dateStr: string) => {
        const date = new Date(dateStr + "T00:00:00")
        return budgetPeriods.find(period => {
          const start = new Date(period.start_date + "T00:00:00")
          const end = new Date(period.end_date + "T23:59:59")
          return date >= start && date <= end
        })
      }

      // Calculate new total from payments
      const scheduleTotal = state.payments.reduce((sum, p) => sum + p.amount, 0)

      // Delete old contract and create new one with updated data
      // This is simpler than updating payments individually
      await deleteContract(contract.id)

      const contractInput: CreateContractInput = {
        athlete_name: state.formData.athleteName,
        counterparty_name: state.formData.counterpartyName,
        team: teamCode as "MBB" | "WBB",
        start_date: state.formData.startDate,
        end_date: state.formData.endDate,
        total_value: scheduleTotal,
        payment_frequency: state.formData.paymentFrequency,
        status: "active",
      }

      const paymentsInput: Omit<CreatePaymentInput, 'contract_id'>[] = state.payments.map(p => ({
        payment_date: p.date,
        amount: p.amount,
        cap_period_label: p.capPeriod,
      }))

      // Build cap allocations by calculating from payment dates
      // This ensures we always create proper cap allocations even if they weren't stored before
      const allocationsByPeriod: Record<string, number> = {}
      for (const payment of state.payments) {
        if (payment.capApplicable !== false && payment.date) {
          const budgetPeriod = findBudgetPeriodForDate(payment.date)
          if (budgetPeriod) {
            allocationsByPeriod[budgetPeriod.id] = (allocationsByPeriod[budgetPeriod.id] || 0) + payment.amount
          }
        }
      }

      const capAllocationsInput: Omit<CreateCapAllocationInput, 'contract_id'>[] = Object.entries(allocationsByPeriod).map(([budget_period_id, allocated_amount]) => ({
        budget_period_id,
        allocated_amount,
      }))

      // Build conditional payments input
      const conditionalPaymentsInput: Omit<CreateConditionalPaymentInput, 'contract_id'>[] = (state.conditionalPayments || []).map(p => ({
        payment_date: p.date,
        amount: p.amount,
        payment_type: p.type,
        cap_period: p.capPeriod,
      }))

      await createContract(contractInput, paymentsInput, capAllocationsInput, conditionalPaymentsInput)
      
      router.push("/agreements")
    } catch (error) {
      console.error("Error saving contract:", error)
      alert("Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    router.push("/agreements")
  }

  const handleComplete = () => {
    router.push("/agreements")
  }

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading agreement...</div>
      </div>
    )
  }

  // Show review or export stage
  if (state.stage === "export") {
    return (
      <BuildExportStage 
        onBack={() => setStage("review")}
        onCancel={handleCancel}
        onComplete={handleComplete}
        isEditing={true}
        onSave={handleSave}
        saving={saving}
      />
    )
  }

  return (
    <BuildReviewStage 
      onBack={handleCancel}
      isEditing={true}
    />
  )
}

// Wrapper that provides the context
export function EditAgreementClient({ contract }: EditAgreementClientProps) {
  return (
    <BuildContractProvider>
      <EditAgreementInner contract={contract} />
    </BuildContractProvider>
  )
}
