import { TeamRoster } from "@/components/planning/team-roster"

interface TeamPageProps {
  params: Promise<{ teamId: string }>
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { teamId } = await params
  return <TeamRoster teamId={teamId} />
}
