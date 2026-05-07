"use client"

import { motion } from "framer-motion"
import { CheckCircle2, FileDown, Save, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import type { ContractContext } from "@/lib/types"

interface QuickActionsBarProps {
  context: ContractContext | null
}

export function QuickActionsBar({ context }: QuickActionsBarProps) {
  const { toast } = useToast()

  const handleActivate = () => {
    toast({
      title: "Contract activated",
      description: "Contract finalized, payments scheduled, and marked as active.",
    })
  }

  const handleExport = () => {
    toast({
      title: "Report exported",
      description: "Full analysis and extracted obligations downloaded as PDF.",
    })
  }

  const handleSaveForReview = () => {
    toast({
      title: "Saved for review",
      description: "Contract saved in 'Pending Review' status.",
    })
  }

  const handleReject = () => {
    toast({
      title: "Contract rejected",
      description: "Contract has been removed from the system.",
      variant: "destructive",
    })
  }

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
      className="fixed bottom-0 left-0 right-0 border-t border-border bg-card/95 backdrop-blur-sm"
    >
      <div className="container mx-auto px-6 py-4">
        <TooltipProvider>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="lg" onClick={handleActivate} className="gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    Activate Contract
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Finalizes the contract, schedules all payments, marks as active</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" onClick={handleExport} className="gap-2 bg-transparent">
                    <FileDown className="h-5 w-5" />
                    Export Report
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Downloads PDF with full analysis and extracted obligations</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" size="lg" onClick={handleSaveForReview} className="gap-2 bg-transparent">
                    <Save className="h-5 w-5" />
                    Save for Review
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Saves in "Pending Review" status, returns to athlete page</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={handleReject}
                    className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <XCircle className="h-5 w-5" />
                    Reject
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Opens confirmation dialog, then removes contract</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}
