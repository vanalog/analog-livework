import { SponsorDetail } from "@/components/sponsor-detail"

export default function SponsorDetailPage({ params }: { params: { id: string } }) {
  return <SponsorDetail sponsorId={params.id} />
}
