import { NegotiationDetail } from "@/components/contracts2/negotiation-detail"

export default function NegotiationContractPage({ params }: { params: { id: string } }) {
  return <NegotiationDetail contractId={params.id} />
}
