"use client"

import { ContractManagement } from "@/components/contract-management"
import { useEffect } from "react"

export default function ContractsPage() {
  useEffect(() => {
    // Dispatch a custom event when the page loads to reset contract view
    window.dispatchEvent(new CustomEvent("resetContractView"))
  }, [])

  return <ContractManagement />
}
