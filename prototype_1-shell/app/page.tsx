"use client"

import { BuildContractProvider, useBuildContract } from "@/lib/build-contract-context"
import { BuildDefineStage } from "@/components/contracts2/build-define-stage"
import { BuildGenerateStage } from "@/components/contracts2/build-generate-stage"
import { BuildReviewStage } from "@/components/contracts2/build-review-stage"
import { BuildExportStage } from "@/components/contracts2/build-export-stage"

function BuildContractWorkflow() {
  const { state, setStage, resetBuildWorkflow } = useBuildContract()

  const handleCancel = () => {
    resetBuildWorkflow()
  }

  const handleComplete = () => {
    resetBuildWorkflow()
  }

  return (
    <div className="min-h-screen">
      {state.stage === "define" && (
        <BuildDefineStage onCancel={handleCancel} />
      )}
      {state.stage === "generate" && <BuildGenerateStage />}
      {state.stage === "review" && <BuildReviewStage onBack={() => setStage("define")} />}
      {state.stage === "export" && (
        <BuildExportStage onComplete={handleComplete} />
      )}
    </div>
  )
}

export default function HomePage() {
  return (
    <BuildContractProvider>
      <BuildContractWorkflow />
    </BuildContractProvider>
  )
}
