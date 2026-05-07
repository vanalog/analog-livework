"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { CheckCircle2, AlertTriangle, DollarSign, FileText, ArrowLeftRight, Loader2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ContractContext, CounterpartyData } from "@/lib/types"

interface SummaryStateProps {
  file?: File
  fileName?: string
  onContinue: () => void
  context: ContractContext | null
  counterparty: CounterpartyData | null
}

export function SummaryState({ file, fileName, onContinue, context, counterparty }: SummaryStateProps) {
  const [showMetrics, setShowMetrics] = useState(false)
  const [showRedirect, setShowRedirect] = useState(false)

  const displayFileName = file?.name || fileName || "Contract"

  useEffect(() => {
    setTimeout(() => setShowMetrics(true), 300)

    setTimeout(() => setShowRedirect(true), 1500)

    const autoTransitionTimer = setTimeout(() => {
      onContinue()
    }, 3000)

    return () => {
      clearTimeout(autoTransitionTimer)
    }
  }, [onContinue])

  const metrics = [
    {
      icon: FileText,
      label: "Pages Analyzed",
      value: "24",
      color: "primary",
      delay: 0.15,
    },
    {
      icon: CheckCircle2,
      label: "Compliance Items",
      value: "12",
      color: "green",
      delay: 0.3,
    },
    {
      icon: AlertTriangle,
      label: "Issues Found",
      value: "3",
      color: "orange",
      delay: 0.45,
    },
    {
      icon: DollarSign,
      label: "Payment Obligations",
      value: "8",
      color: "primary",
      delay: 0.6,
    },
  ]

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/30 p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 15 }}
            className="mb-4 flex justify-center"
          >
            <div className="rounded-full bg-green-100 p-5 dark:bg-green-900/30">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              >
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </motion.div>
            </div>
          </motion.div>

          {context && counterparty ? (
            <div className="mb-3">
              <div className="mb-2 flex items-center justify-center gap-3">
                <span className="text-2xl font-bold leading-tight">
                  {context.type === "athlete" ? context.name : counterparty.name}
                </span>
                <ArrowLeftRight className="h-6 w-6 text-muted-foreground" />
                <span className="text-2xl font-bold leading-tight">
                  {context.type === "sponsor" ? context.name : counterparty.name}
                </span>
              </div>
              <h1 className="text-4xl font-bold leading-tight">Agreement Analyzed</h1>
            </div>
          ) : (
            <h1 className="mb-3 text-4xl font-bold leading-tight">Contract Intelligence Complete</h1>
          )}
          <p className="text-lg text-muted-foreground leading-relaxed">{displayFileName}</p>
        </motion.div>

        {showMetrics && (
          <>
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {metrics.map((metric) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: metric.delay, type: "spring", stiffness: 200, damping: 20 }}
                  className="rounded-2xl border bg-white p-5 shadow-medium dark:bg-card"
                >
                  <div
                    className={`mb-3 inline-flex rounded-lg p-2.5 ${
                      metric.color === "green"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : metric.color === "orange"
                          ? "bg-orange-100 dark:bg-orange-900/30"
                          : "bg-primary/10"
                    }`}
                  >
                    <metric.icon
                      className={`h-5 w-5 ${
                        metric.color === "green"
                          ? "text-green-600 dark:text-green-400"
                          : metric.color === "orange"
                            ? "text-orange-500"
                            : "text-primary"
                      }`}
                    />
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: metric.delay + 0.15, type: "spring", stiffness: 300 }}
                    className="mb-1.5 text-3xl font-bold leading-tight"
                  >
                    {metric.value}
                  </motion.div>
                  <div className="text-sm font-medium text-muted-foreground leading-tight">{metric.label}</div>
                </motion.div>
              ))}
            </div>

            {showRedirect && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Redirecting to contract details...</span>
                </div>
                <Button variant="ghost" size="sm" onClick={onContinue} className="text-primary hover:text-primary">
                  View Details Now
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </>
        )}
      </motion.div>
    </div>
  )
}
