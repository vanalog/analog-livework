"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Calendar,
  Sparkles,
  Search,
  User,
  Building2,
} from "lucide-react"
import type { ContractContext, CounterpartyData } from "@/lib/types"

interface ProcessingStateProps {
  file: File
  context: ContractContext | null
  onComplete: (counterparty: CounterpartyData) => void
}

interface ProgressItem {
  id: string
  text: string
  icon: "check" | "warning" | "dollar"
  snippet?: string
  completed?: boolean
}

export function ProcessingState({ file, context, onComplete }: ProcessingStateProps) {
  const [scanPosition, setScanPosition] = useState(0)
  const [complianceItems, setComplianceItems] = useState<ProgressItem[]>([])
  const [obligationItems, setObligationItems] = useState<ProgressItem[]>([])
  const [highlightAreas, setHighlightAreas] = useState<number[]>([])
  const [showCounterparty, setShowCounterparty] = useState(false)
  const [detectedCounterparty, setDetectedCounterparty] = useState<CounterpartyData | null>(null)

  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanPosition((prev) => (prev >= 100 ? 0 : prev + 2))
    }, 50)

    const timers: NodeJS.Timeout[] = []

    if (context) {
      const mockCounterparty: CounterpartyData =
        context.type === "athlete"
          ? {
              type: "sponsor",
              name: "Nike Basketball Division",
              logo: "/placeholder.svg?height=100&width=100",
              extractedFrom: "Section 2.1 - Parties",
            }
          : {
              type: "athlete",
              name: "Marcus Johnson",
              photo: "/placeholder.svg?height=100&width=100",
              extractedFrom: "Section 1.3 - Beneficiary",
            }

      setDetectedCounterparty(mockCounterparty)

      timers.push(
        setTimeout(() => {
          setShowCounterparty(true)
        }, 2000),
      )

      timers.push(
        setTimeout(() => {
          onComplete(mockCounterparty)
        }, 4000),
      )
    }

    const discoveries = [
      {
        delay: 500,
        type: "compliance" as const,
        item: {
          id: "c1",
          text: "Governance clause identified",
          icon: "check" as const,
          snippet: "...Board approval required for transactions exceeding...",
        },
        highlight: 15,
      },
      {
        delay: 800,
        type: "obligation" as const,
        item: {
          id: "o1",
          text: "Payment term discovered",
          icon: "dollar" as const,
          snippet: "...payment of $50,000 upon contract signing...",
        },
        highlight: 35,
      },
      {
        delay: 1400,
        type: "compliance" as const,
        item: {
          id: "c2",
          text: "Regulatory requirement found",
          icon: "check" as const,
          snippet: "...compliance with GDPR data protection standards...",
        },
        highlight: 52,
      },
      {
        delay: 1700,
        type: "obligation" as const,
        item: {
          id: "o2",
          text: "Milestone trigger detected",
          icon: "dollar" as const,
          snippet: "...quarterly reviews required within 30 days...",
        },
        highlight: 68,
      },
      {
        delay: 2300,
        type: "compliance" as const,
        item: {
          id: "c3",
          text: "Potential conflict detected",
          icon: "warning" as const,
          snippet: "...termination clause may conflict with Section 4.2...",
        },
        highlight: 78,
      },
      {
        delay: 2600,
        type: "obligation" as const,
        item: {
          id: "o3",
          text: "Beneficiary identified",
          icon: "dollar" as const,
          snippet: "...payments to be made to Acme Corporation...",
        },
        highlight: 85,
      },
      {
        delay: 3200,
        type: "compliance" as const,
        item: { id: "c4", text: "Cross-referencing policies", icon: "check" as const },
        highlight: 42,
      },
      {
        delay: 3500,
        type: "obligation" as const,
        item: { id: "o4", text: "Date trigger extracted", icon: "dollar" as const },
        highlight: 25,
      },
    ]

    discoveries.forEach(({ delay, type, item, highlight }) => {
      const timer = setTimeout(() => {
        if (type === "compliance") {
          setComplianceItems((prev) => [...prev, item])
        } else {
          setObligationItems((prev) => [...prev, item])
        }
        setHighlightAreas((prev) => [...prev, highlight])

        // Mark as completed after 1 second
        setTimeout(() => {
          if (type === "compliance") {
            setComplianceItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, completed: true } : i)))
          } else {
            setObligationItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, completed: true } : i)))
          }
        }, 1000)

        setTimeout(() => {
          setHighlightAreas((prev) => prev.filter((h) => h !== highlight))
        }, 1000)
      }, delay)
      timers.push(timer)
    })

    return () => {
      clearInterval(scanInterval)
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [context])

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Live Document Analysis */}
      <div className="relative flex w-[45%] items-center justify-center border-r p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-xl"
        >
          <div className="mb-4 flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold leading-tight">Live Document Analysis</h2>
          </div>

          <div className="relative overflow-hidden rounded-2xl border bg-white p-6 shadow-medium dark:bg-card">
            {/* Simulated document content (blurred) */}
            <div className="space-y-2.5 blur-sm">
              <div className="h-2.5 w-full rounded bg-muted" />
              <div className="h-2.5 w-5/6 rounded bg-muted" />
              <div className="h-2.5 w-full rounded bg-muted" />
              <div className="h-2.5 w-4/6 rounded bg-muted" />
              <div className="mt-3 h-2.5 w-full rounded bg-muted" />
              <div className="h-2.5 w-full rounded bg-muted" />
              <div className="h-2.5 w-3/4 rounded bg-muted" />
              <div className="mt-3 h-2.5 w-full rounded bg-muted" />
              <div className="h-2.5 w-5/6 rounded bg-muted" />
              <div className="h-2.5 w-full rounded bg-muted" />
            </div>

            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
              style={{ top: `${scanPosition}%` }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />

            <AnimatePresence>
              {highlightAreas.map((position) => (
                <motion.div
                  key={position}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute left-4 right-4 h-8 rounded bg-green-500/20"
                  style={{ top: `${position}%` }}
                />
              ))}
            </AnimatePresence>

            {/* Sparkle particles */}
            <motion.div
              className="absolute right-4 top-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            >
              <Sparkles className="h-5 w-5 text-primary/30" />
            </motion.div>
          </div>

          <div className="mt-4 space-y-2">
            <AnimatePresence>
              {[...complianceItems, ...obligationItems]
                .filter((item) => item.snippet)
                .slice(-2)
                .map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-lg border bg-muted p-2.5"
                  >
                    <p className="font-mono text-xs text-muted-foreground leading-relaxed">{item.snippet}</p>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Right Panel - Intelligence Engine */}
      <div className="flex w-[55%] flex-col overflow-y-auto bg-muted/30 p-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex h-full flex-col"
        >
          <h2 className="mb-4 text-xl font-semibold leading-tight">Intelligence Engine</h2>

          {context && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-2xl border bg-white p-4 shadow-soft dark:bg-card"
            >
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5">
                  <Search className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-base font-semibold leading-tight">
                  {showCounterparty ? "Counterparty Identified" : "Identifying counterparty..."}
                </h3>
              </div>

              <AnimatePresence mode="wait">
                {!showCounterparty ? (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent"
                    />
                    <span>Extracting {context.type === "athlete" ? "sponsor" : "athlete"} information...</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="found"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-3 rounded-lg bg-muted p-3"
                  >
                    {detectedCounterparty?.type === "athlete" ? (
                      <User className="h-6 w-6 text-primary" />
                    ) : (
                      <Building2 className="h-6 w-6 text-primary" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold leading-tight">{detectedCounterparty?.name}</p>
                      <p className="text-xs text-muted-foreground">Found in: {detectedCounterparty?.extractedFrom}</p>
                    </div>
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          <div className="flex flex-1 flex-col gap-4">
            <div className="flex-1 rounded-2xl border bg-white p-4 shadow-soft dark:bg-card">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-green-100 p-1.5 dark:bg-green-900/30">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-base font-semibold leading-tight">Compliance Analysis</h3>
              </div>

              <div className="space-y-1.5">
                <AnimatePresence>
                  {complianceItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: item.completed ? 0.5 : 1,
                        x: 0,
                        filter: item.completed ? "blur(0.5px)" : "blur(0px)",
                      }}
                      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                      className="flex items-center gap-2.5 rounded-lg bg-muted p-2.5"
                    >
                      {item.icon === "check" ? (
                        <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-green-600 dark:text-green-400" />
                      ) : (
                        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 text-orange-500" />
                      )}
                      <span className="text-sm leading-tight">{item.text}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="flex-1 rounded-2xl border bg-white p-4 shadow-soft dark:bg-card">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-lg bg-primary/10 p-1.5">
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-base font-semibold leading-tight">Obligation Extraction</h3>
              </div>

              <div className="space-y-1.5">
                <AnimatePresence>
                  {obligationItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{
                        opacity: item.completed ? 0.5 : 1,
                        scale: 1,
                        filter: item.completed ? "blur(0.5px)" : "blur(0px)",
                      }}
                      transition={{ duration: 0.4, type: "spring", ease: "easeOut" }}
                      className="flex items-center gap-2.5 rounded-lg bg-muted p-2.5"
                    >
                      <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-primary" />
                      <span className="text-sm leading-tight">{item.text}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Processing indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center text-sm text-muted-foreground"
          >
            <div className="flex items-center justify-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent"
              />
              <span>Analyzing contract securely...</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
