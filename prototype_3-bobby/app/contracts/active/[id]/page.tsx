"use client"

import { useParams } from "next/navigation"
import { ActiveContractDetail } from "@/components/active-contract-detail"

export default function ActiveContractDetailPage() {
  const params = useParams()
  const contractId = params.id as string

  return <ActiveContractDetail contractId={contractId} />
}
