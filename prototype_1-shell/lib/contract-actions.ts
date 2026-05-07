"use server"

import { createClient } from "@/lib/supabase/server"
import type { 
  Contract, 
  ContractPayment, 
  ContractCapAllocation,
  ContractConditionalPayment,
  CreateContractInput,
  CreatePaymentInput,
  CreateCapAllocationInput,
  CreateConditionalPaymentInput,
  ContractWithDetails 
} from "./contract-types"

// NOTE: This function is disabled - committed_amount is now manually managed
// and Agreement Payments from contracts are shown separately
// async function recalculateCommittedAmount(budgetPeriodId: string): Promise<void> {
//   ... disabled ...
// }

// No-op version to maintain compatibility with existing call sites
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function recalculateCommittedAmount(_budgetPeriodId: string): Promise<void> {
  // Disabled: committed_amount is now manually editable
  // Agreement payments from contracts are displayed separately
  return
}

// Create a new contract with payments, conditional payments, and cap allocations
export async function createContract(
  input: CreateContractInput,
  payments: Omit<CreatePaymentInput, 'contract_id'>[],
  capAllocations: Omit<CreateCapAllocationInput, 'contract_id'>[],
  conditionalPayments?: Omit<CreateConditionalPaymentInput, 'contract_id'>[]
): Promise<ContractWithDetails> {
  const supabase = await createClient()

  // 1. Create the contract
  const { data: contract, error: contractError } = await supabase
    .from("contracts")
    .insert({
      athlete_name: input.athlete_name,
      counterparty_name: input.counterparty_name,
      team: input.team,
      contract_type: 'revenue-share',
      start_date: input.start_date,
      end_date: input.end_date,
      total_value: input.total_value,
      payment_frequency: input.payment_frequency,
      status: input.status || 'active',
    })
    .select()
    .single()

  if (contractError || !contract) {
    throw new Error(`Failed to create contract: ${contractError?.message || 'Unknown error'}`)
  }

  // 2. Create payments
  const paymentsToInsert = payments.map(p => ({
    contract_id: contract.id,
    payment_date: p.payment_date,
    amount: p.amount,
    cap_period: p.cap_period_label,
  }))

  const { data: createdPayments, error: paymentsError } = await supabase
    .from("contract_payments")
    .insert(paymentsToInsert)
    .select()

  if (paymentsError) {
    // Rollback: delete the contract
    await supabase.from("contracts").delete().eq("id", contract.id)
    throw new Error(`Failed to create contract payments: ${paymentsError?.message || 'Unknown error'}`)
  }

  // 3. Create cap allocations
  const allocationsToInsert = capAllocations.map(a => ({
    contract_id: contract.id,
    budget_period_id: a.budget_period_id,
    allocated_amount: a.allocated_amount,
  }))

  const { data: createdAllocations, error: allocationsError } = await supabase
    .from("contract_cap_allocations")
    .insert(allocationsToInsert)
    .select()

  if (allocationsError) {
    console.error("Error creating cap allocations:", allocationsError)
    // Rollback: delete payments and contract
    await supabase.from("contract_payments").delete().eq("contract_id", contract.id)
    await supabase.from("contracts").delete().eq("id", contract.id)
    throw new Error("Failed to create cap allocations")
  }

  // 4. Create conditional payments (if any)
  let createdConditionalPayments: ContractConditionalPayment[] = []
  if (conditionalPayments && conditionalPayments.length > 0) {
    const conditionalToInsert = conditionalPayments.map(p => ({
      contract_id: contract.id,
      payment_date: p.payment_date,
      amount: p.amount,
      payment_type: p.payment_type,
      cap_period: p.cap_period,
    }))

    const { data: condPayments, error: conditionalError } = await supabase
      .from("contract_conditional_payments")
      .insert(conditionalToInsert)
      .select()

    if (conditionalError) {
      console.error("Error creating conditional payments:", conditionalError)
      // Rollback: delete allocations, payments, and contract
      await supabase.from("contract_cap_allocations").delete().eq("contract_id", contract.id)
      await supabase.from("contract_payments").delete().eq("contract_id", contract.id)
      await supabase.from("contracts").delete().eq("id", contract.id)
      throw new Error("Failed to create conditional payments")
    }
    createdConditionalPayments = condPayments || []
  }

  // 5. Recalculate committed amounts for affected budget periods
  const affectedPeriodIds = [...new Set(capAllocations.map(a => a.budget_period_id))]
  for (const periodId of affectedPeriodIds) {
    await recalculateCommittedAmount(periodId)
  }

  return {
    ...contract,
    payments: createdPayments || [],
    conditional_payments: createdConditionalPayments,
    cap_allocations: createdAllocations || [],
  }
}

// Get a contract with all related data
export async function getContract(contractId: string): Promise<ContractWithDetails | null> {
  const supabase = await createClient()

  const { data: contract, error: contractError } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", contractId)
    .single()

  if (contractError || !contract) {
    console.error("Error fetching contract:", contractError)
    return null
  }

  const { data: payments } = await supabase
    .from("contract_payments")
    .select("*")
    .eq("contract_id", contractId)
    .order("payment_date", { ascending: true })

  const { data: allocations } = await supabase
    .from("contract_cap_allocations")
    .select("*")
    .eq("contract_id", contractId)

  const { data: conditionalPayments } = await supabase
    .from("contract_conditional_payments")
    .select("*")
    .eq("contract_id", contractId)
    .order("payment_date", { ascending: true })

  return {
    ...contract,
    payments: payments || [],
    conditional_payments: conditionalPayments || [],
    cap_allocations: allocations || [],
  }
}

// Get all contracts with optional filters
export async function getContracts(filters?: {
  team?: 'MBB' | 'WBB'
  status?: Contract['status']
  athlete_name?: string
}): Promise<Contract[]> {
  const supabase = await createClient()

  let query = supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false })

  if (filters?.team) {
    query = query.eq("team", filters.team)
  }
  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.athlete_name) {
    query = query.ilike("athlete_name", `%${filters.athlete_name}%`)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching contracts:", error)
    throw new Error("Failed to fetch contracts")
  }

  return data || []
}

// Update a contract
export async function updateContract(
  contractId: string,
  updates: Partial<CreateContractInput>
): Promise<Contract> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("contracts")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contractId)
    .select()
    .single()

  if (error) {
    console.error("Error updating contract:", error)
    throw new Error("Failed to update contract")
  }

  return data
}

// Update contract status (and recalculate caps if cancelling)
export async function updateContractStatus(
  contractId: string,
  status: Contract['status']
): Promise<Contract> {
  const supabase = await createClient()

  // Get current allocations before update
  const { data: allocations } = await supabase
    .from("contract_cap_allocations")
    .select("budget_period_id")
    .eq("contract_id", contractId)

  // Update the status
  const { data, error } = await supabase
    .from("contracts")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contractId)
    .select()
    .single()

  if (error) {
    console.error("Error updating contract status:", error)
    throw new Error("Failed to update contract status")
  }

  // Recalculate committed amounts for affected budget periods
  // (especially important when cancelling - removes from committed)
  const affectedPeriodIds = [...new Set((allocations || []).map(a => a.budget_period_id))]
  for (const periodId of affectedPeriodIds) {
    await recalculateCommittedAmount(periodId)
  }

  return data
}

// Delete a contract and recalculate affected caps
export async function deleteContract(contractId: string): Promise<void> {
  const supabase = await createClient()

  // Get allocations before deletion to know which periods to recalculate
  const { data: allocations } = await supabase
    .from("contract_cap_allocations")
    .select("budget_period_id")
    .eq("contract_id", contractId)

  const affectedPeriodIds = [...new Set((allocations || []).map(a => a.budget_period_id))]

  // Delete the contract (cascade will handle payments and allocations)
  const { error } = await supabase
    .from("contracts")
    .delete()
    .eq("id", contractId)

  if (error) {
    console.error("Error deleting contract:", error)
    throw new Error("Failed to delete contract")
  }

  // Recalculate committed amounts for affected budget periods
  for (const periodId of affectedPeriodIds) {
    await recalculateCommittedAmount(periodId)
  }
}

// Update cap allocations for a contract (used when editing)
export async function updateContractCapAllocations(
  contractId: string,
  newAllocations: Omit<CreateCapAllocationInput, 'contract_id'>[]
): Promise<ContractCapAllocation[]> {
  const supabase = await createClient()

  // Get existing allocations to know which periods to recalculate
  const { data: existingAllocations } = await supabase
    .from("contract_cap_allocations")
    .select("budget_period_id")
    .eq("contract_id", contractId)

  const existingPeriodIds = (existingAllocations || []).map(a => a.budget_period_id)

  // Delete existing allocations
  await supabase
    .from("contract_cap_allocations")
    .delete()
    .eq("contract_id", contractId)

  // Insert new allocations
  const allocationsToInsert = newAllocations.map(a => ({
    contract_id: contractId,
    budget_period_id: a.budget_period_id,
    allocated_amount: a.allocated_amount,
  }))

  const { data: createdAllocations, error } = await supabase
    .from("contract_cap_allocations")
    .insert(allocationsToInsert)
    .select()

  if (error) {
    console.error("Error updating cap allocations:", error)
    throw new Error("Failed to update cap allocations")
  }

  // Recalculate all affected budget periods (both old and new)
  const newPeriodIds = newAllocations.map(a => a.budget_period_id)
  const allAffectedPeriodIds = [...new Set([...existingPeriodIds, ...newPeriodIds])]
  
  for (const periodId of allAffectedPeriodIds) {
    await recalculateCommittedAmount(periodId)
  }

  return createdAllocations || []
}

// Get all contracts with their cap allocations and budget period details
export async function getContractsWithCapAllocations(): Promise<
  (Contract & { 
    cap_allocations: (ContractCapAllocation & { 
      budget_period: { fiscal_year_label: string; budget_type_id: string } 
    })[] 
  })[]
> {
  const supabase = await createClient()

  const { data: contracts, error: contractError } = await supabase
    .from("contracts")
    .select("*")
    .order("created_at", { ascending: false })

  if (contractError) {
    console.error("Error fetching contracts:", contractError)
    throw new Error("Failed to fetch contracts")
  }

  // Fetch all cap allocations with budget period info
  const { data: allocations, error: allocError } = await supabase
    .from("contract_cap_allocations")
    .select(`
      *,
      budget_period:budget_periods(fiscal_year_label, budget_type_id)
    `)

  if (allocError) {
    console.error("Error fetching cap allocations:", allocError)
    throw new Error("Failed to fetch cap allocations")
  }

  // Group allocations by contract_id
  const allocationsByContract: Record<string, (ContractCapAllocation & { budget_period: { fiscal_year_label: string; budget_type_id: string } })[]> = {}
  for (const alloc of allocations || []) {
    if (!allocationsByContract[alloc.contract_id]) {
      allocationsByContract[alloc.contract_id] = []
    }
    allocationsByContract[alloc.contract_id].push(alloc as ContractCapAllocation & { budget_period: { fiscal_year_label: string; budget_type_id: string } })
  }

  return (contracts || []).map(contract => ({
    ...contract,
    cap_allocations: allocationsByContract[contract.id] || []
  }))
}

// Get contracts that affect a specific budget period
export async function getContractsForBudgetPeriod(
  budgetPeriodId: string
): Promise<(Contract & { allocated_amount: number })[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("contract_cap_allocations")
    .select(`
      allocated_amount,
      contracts(*)
    `)
    .eq("budget_period_id", budgetPeriodId)

  if (error) {
    console.error("Error fetching contracts for budget period:", error)
    throw new Error("Failed to fetch contracts for budget period")
  }

  return (data || []).map((item: { allocated_amount: number; contracts: Contract }) => ({
    ...item.contracts,
    allocated_amount: item.allocated_amount,
  }))
}
