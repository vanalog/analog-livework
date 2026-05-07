import { use } from "react"
import { BeneficiaryDetailManagement } from "@/components/beneficiary-detail-management"

export default function BeneficiaryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return <BeneficiaryDetailManagement beneficiaryId={id} />
}
