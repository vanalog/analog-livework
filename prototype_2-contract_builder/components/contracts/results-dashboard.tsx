"use client"

import { motion } from "framer-motion"
import { ArrowLeft, User, Building2, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EnhancedPermissibilityReview } from "@/components/contracts/enhanced-permissibility-review"
import { EnhancedObligationsReview } from "@/components/contracts/enhanced-obligations-review"
import { QuickActionsBar } from "@/components/contracts/quick-actions-bar"
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import type { ContractContext, CounterpartyData } from "@/lib/types"

interface ResultsDashboardProps {
  context: ContractContext | null
  counterparty: CounterpartyData | null
  onStartOver: () => void
  onSaveAndExit: () => void
}

export function ResultsDashboard({ context, counterparty, onStartOver, onSaveAndExit }: ResultsDashboardProps) {
  const timeAgo = "2 minutes ago"

  const permissibilityContent = EnhancedPermissibilityReview({ contractId: "new-contract" })
  const obligationsContent = EnhancedObligationsReview({ contractId: "new-contract" })

  // Check if content is a detail view (object with listPanel/detailPanel) or overview (JSX)
  const isPermissibilityDetailView =
    typeof permissibilityContent === "object" &&
    permissibilityContent !== null &&
    "listPanel" in permissibilityContent &&
    "detailPanel" in permissibilityContent

  const isObligationsDetailView =
    typeof obligationsContent === "object" &&
    obligationsContent !== null &&
    "listPanel" in obligationsContent &&
    "detailPanel" in obligationsContent

  const backLinkText =
    isPermissibilityDetailView || isObligationsDetailView ? "Contract Review Overview" : context?.name || "Contracts"

  return (
    <div className="min-h-screen bg-background pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-border bg-card"
      >
        <div className="container mx-auto px-6 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={
                  isPermissibilityDetailView || isObligationsDetailView
                    ? (permissibilityContent as any).actionHandlers?.onBack ||
                      (obligationsContent as any).actionHandlers?.onBack
                    : onSaveAndExit
                }
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {backLinkText}
              </Button>
              <div className="h-6 w-px bg-border" />

              {context && counterparty && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {context.type === "athlete" ? (
                      <User className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-semibold text-foreground leading-tight">{context.name}</span>
                  </div>
                  <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    {counterparty.type === "athlete" ? (
                      <User className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-semibold text-foreground leading-tight">{counterparty.name}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-muted-foreground">Analysis completed {timeAgo}</div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-8">
        {isPermissibilityDetailView || isObligationsDetailView ? (
          // Detail view - two-panel layout
          <div className="grid gap-6 lg:grid-cols-[30%_70%]">
            <div>
              {isPermissibilityDetailView
                ? (permissibilityContent as any).listPanel
                : isObligationsDetailView
                  ? (obligationsContent as any).listPanel
                  : null}
            </div>
            <div>
              {isPermissibilityDetailView
                ? (permissibilityContent as any).detailPanel
                : isObligationsDetailView
                  ? (obligationsContent as any).detailPanel
                  : null}
            </div>
          </div>
        ) : (
          // Overview - two-column grid
          <div className="grid gap-6 lg:grid-cols-2">
            {permissibilityContent}
            {obligationsContent}
          </div>
        )}
      </div>

      {isPermissibilityDetailView && (permissibilityContent as any).modal}
      {isObligationsDetailView && (obligationsContent as any).modal}

      {isObligationsDetailView && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <kbd className="rounded border border-border bg-muted px-2 py-1">Enter</kbd>
                <span>Confirm</span>
                <span className="mx-2">•</span>
                <kbd className="rounded border border-border bg-muted px-2 py-1">←</kbd>
                <kbd className="rounded border border-border bg-muted px-2 py-1">→</kbd>
                <span>Navigate</span>
                <span className="mx-2">•</span>
                <kbd className="rounded border border-border bg-muted px-2 py-1">Esc</kbd>
                <span>Back</span>
              </div>

              <div className="flex items-center gap-2">
                {obligationsContent && (obligationsContent as any).actionHandlers && (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={(obligationsContent as any).actionHandlers.onConfirm}
                            disabled={!(obligationsContent as any).actionHandlers.canConfirm}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Confirm Obligation
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mark as confirmed and continue</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={(obligationsContent as any).actionHandlers.onDelete}
                            disabled={!(obligationsContent as any).actionHandlers.canDelete}
                            variant="destructive"
                          >
                            Delete Obligation
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Remove this obligation</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {!isObligationsDetailView && <QuickActionsBar context={context} />}
    </div>
  )
}
