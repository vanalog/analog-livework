"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { UploadState } from "@/components/contracts/upload-state"
import { ProcessingState } from "@/components/contracts/processing-state"
import { SummaryState } from "@/components/contracts/summary-state"
import { ResultsDashboard } from "@/components/contracts/results-dashboard"
import type { ContractContext, CounterpartyData } from "@/lib/types"

const mockAthletes = [
  // Verified Athletes - OSU Football
  { id: "osu-001", name: "Darius Thornton", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-002", name: "Malik Crawford", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-003", name: "Jaylen Porter", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-004", name: "Terrance Mitchell", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-005", name: "Brandon Hayes", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-006", name: "Jack Sawyer", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-007", name: "Caleb Downs", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-008", name: "Will Howard", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-009", name: "JT Tuimoloau", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-010", name: "Cody Simon", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-011", name: "Carnell Tate", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-012", name: "Josh Simmons", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-013", name: "Sonny Styles", photo: "/placeholder.svg?height=100&width=100" },
  { id: "osu-014", name: "Jayden McClellan", photo: "/placeholder.svg?height=100&width=100" },
  // Women's Basketball Athletes
  { id: "lsu-wbb-001", name: "Taylor Brooks", photo: "/placeholder.svg?height=100&width=100" },
  { id: "lsu-wbb-002", name: "Nia Jackson", photo: "/placeholder.svg?height=100&width=100" },
  { id: "lsu-wbb-003", name: "Morgan Davis", photo: "/placeholder.svg?height=100&width=100" },
  { id: "sc-wbb-001", name: "Kayla Henderson", photo: "/placeholder.svg?height=100&width=100" },
  { id: "sc-wbb-002", name: "Maya Robinson", photo: "/placeholder.svg?height=100&width=100" },
  { id: "sc-wbb-003", name: "Brianna Foster", photo: "/placeholder.svg?height=100&width=100" },
  { id: "uconn-wbb-001", name: "Jasmine Richardson", photo: "/placeholder.svg?height=100&width=100" },
  { id: "uconn-wbb-002", name: "Aaliyah Thompson", photo: "/placeholder.svg?height=100&width=100" },
  { id: "uconn-wbb-003", name: "Destiny Williams", photo: "/placeholder.svg?height=100&width=100" },
  { id: "iowa-wbb-001", name: "Kennedy Carter", photo: "/placeholder.svg?height=100&width=100" },
  { id: "iowa-wbb-002", name: "Skylar Johnson", photo: "/placeholder.svg?height=100&width=100" },
  { id: "iowa-wbb-003", name: "Jordan Mitchell", photo: "/placeholder.svg?height=100&width=100" },
  { id: "stan-wbb-001", name: "Cameron Chen", photo: "/placeholder.svg?height=100&width=100" },
  { id: "stan-wbb-002", name: "Zoe Martinez", photo: "/placeholder.svg?height=100&width=100" },
  { id: "stan-wbb-003", name: "Simone Washington", photo: "/placeholder.svg?height=100&width=100" },
  { id: "texas-wbb-001", name: "Jada Williams", photo: "/placeholder.svg?height=100&width=100" },
  { id: "texas-wbb-002", name: "Avery Coleman", photo: "/placeholder.svg?height=100&width=100" },
  { id: "ucla-wbb-001", name: "Alexis Turner", photo: "/placeholder.svg?height=100&width=100" },
  { id: "ucla-wbb-002", name: "Gabrielle Moore", photo: "/placeholder.svg?height=100&width=100" },
  { id: "nd-wbb-001", name: "Olivia Burke", photo: "/placeholder.svg?height=100&width=100" },
  { id: "nd-wbb-002", name: "Mia Sullivan", photo: "/placeholder.svg?height=100&width=100" },
  { id: "ore-wbb-001", name: "Imani Lewis", photo: "/placeholder.svg?height=100&width=100" },
  { id: "ore-wbb-002", name: "Sierra Thompson", photo: "/placeholder.svg?height=100&width=100" },
  // Legacy IDs for backwards compatibility
  { id: "a1", name: "Marcus Johnson", photo: "/placeholder.svg?height=100&width=100" },
  { id: "a2", name: "Sarah Martinez", photo: "/placeholder.svg?height=100&width=100" },
  { id: "1", name: "Marcus Johnson", photo: "/placeholder.svg?height=100&width=100" },
]

const mockSponsors = [
  { id: "s1", name: "Nike Basketball Division", logo: "/placeholder.svg?height=100&width=100" },
  { id: "s2", name: "Gatorade Sports", logo: "/placeholder.svg?height=100&width=100" },
  { id: "1", name: "Nike Basketball Division", logo: "/placeholder.svg?height=100&width=100" },
]

type WorkflowState = "upload" | "processing" | "summary" | "results"

function ContractUploadContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentState, setCurrentState] = useState<WorkflowState>("upload")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [context, setContext] = useState<ContractContext | null>(null)
  const [counterparty, setCounterparty] = useState<CounterpartyData | null>(null)

  // Initialize context from URL params
  useEffect(() => {
    const athleteId = searchParams.get("athlete")
    const sponsorId = searchParams.get("sponsor")
    const type = searchParams.get("type")

    console.log("[v0] Initializing context from URL params:", { athleteId, sponsorId, type })

    if (athleteId) {
      const athlete = mockAthletes.find((a) => a.id === athleteId)
      console.log("[v0] Found athlete:", athlete)
      if (athlete) {
        setContext((prev) => {
          // Only update if context has changed
          if (prev?.id === athlete.id && prev?.type === "athlete") return prev
          return {
            type: "athlete",
            id: athlete.id,
            name: athlete.name,
            photo: athlete.photo,
            role: "beneficiary",
          }
        })
      } else {
        console.log("[v0] No athlete found with id:", athleteId)
      }
    } else if (sponsorId) {
      const sponsor = mockSponsors.find((s) => s.id === sponsorId)
      console.log("[v0] Found sponsor:", sponsor)
      if (sponsor) {
        setContext((prev) => {
          // Only update if context has changed
          if (prev?.id === sponsor.id && prev?.type === "sponsor") return prev
          return {
            type: "sponsor",
            id: sponsor.id,
            name: sponsor.name,
            logo: sponsor.logo,
            role: "source",
          }
        })
      } else {
        console.log("[v0] No sponsor found with id:", sponsorId)
      }
    }
  }, [searchParams])

  const handleFileSelect = useCallback((file: File) => {
    console.log("[v0] File selected:", file.name)
    setUploadedFile(file)
    setCurrentState("processing")
  }, [])

  const handleProcessingComplete = useCallback((detectedCounterparty: CounterpartyData) => {
    console.log("[v0] Processing complete, counterparty:", detectedCounterparty)
    setCounterparty(detectedCounterparty)
    setCurrentState("summary")
  }, [])

  const handleSummaryComplete = useCallback(() => {
    console.log("[v0] Summary complete, moving to results")
    setCurrentState("results")
  }, [])

  const handleStartOver = useCallback(() => {
    setCurrentState("upload")
    setUploadedFile(null)
    setCounterparty(null)
  }, [])

  const handleSaveAndExit = useCallback(() => {
    // Navigate back to originating page
    if (context?.type === "athlete") {
      router.push(`/beneficiaries/${context.id}?tab=contracts`)
    } else if (context?.type === "sponsor") {
      router.push(`/sponsors/${context.id}?tab=contracts`)
    } else {
      router.push("/contracts")
    }
  }, [context, router])

  console.log("[v0] Current state:", currentState, "Context:", context)

  const backHref = context?.type === "athlete"
    ? `/beneficiaries/${context.id}`
    : context?.type === "sponsor"
      ? `/sponsors/${context.id}`
      : "/contracts"

  const backLabel = context?.type === "athlete"
    ? `Back to ${context.name}`
    : context?.type === "sponsor"
      ? `Back to ${context.name}`
      : "Back to Contracts"

  return (
    <div className="min-h-screen bg-background">
      {currentState === "upload" && <UploadState onFileSelect={handleFileSelect} context={context} backHref={backHref} backLabel={backLabel} />}
      {currentState === "processing" && uploadedFile && (
        <ProcessingState file={uploadedFile} context={context} onComplete={handleProcessingComplete} />
      )}
      {currentState === "summary" && counterparty && (
        <SummaryState
          file={uploadedFile || undefined}
          context={context}
          counterparty={counterparty}
          onContinue={handleSummaryComplete}
        />
      )}
      {currentState === "results" && (
        <ResultsDashboard
          context={context}
          counterparty={counterparty}
          onStartOver={handleStartOver}
          onSaveAndExit={handleSaveAndExit}
        />
      )}
    </div>
  )
}

export default function ContractUploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContractUploadContent />
    </Suspense>
  )
}
