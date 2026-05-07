import { getContract } from "@/lib/contract-actions"
import { EditAgreementClient } from "./edit-agreement-client"
import { notFound } from "next/navigation"

interface EditAgreementPageProps {
  params: Promise<{ id: string }>
}

export default async function EditAgreementPage({ params }: EditAgreementPageProps) {
  const { id } = await params
  const contract = await getContract(id)

  if (!contract) {
    notFound()
  }

  return <EditAgreementClient contract={contract} />
}
