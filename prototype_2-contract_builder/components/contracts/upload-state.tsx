"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { motion } from "framer-motion"
import { Upload, FileText, Shield, CheckCircle2, DollarSign, Calendar, FileCheck, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { ContractContext } from "@/lib/types"

interface UploadStateProps {
  onFileSelect: (file: File) => void
  context: ContractContext | null
  backHref?: string
  backLabel?: string
}

export function UploadState({ onFileSelect, context, backHref, backLabel }: UploadStateProps) {
  const router = useRouter()
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
        if (file.size <= 10 * 1024 * 1024) {
          onFileSelect(file)
        } else {
          alert("File size must be less than 10MB")
        }
      } else {
        alert("Please upload a PDF or DOCX file")
      }
    },
    [onFileSelect],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size <= 10 * 1024 * 1024) {
        onFileSelect(file)
      } else {
        alert("File size must be less than 10MB")
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Back button bar - full width, matching athlete page placement */}
      {backHref && backLabel && (
        <div className="px-6 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => router.push(backHref)}
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Left Panel - Document Upload */}
        <div className="flex w-[45%] items-start justify-center border-r p-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl"
          >
            <div className="mb-6 rounded-2xl border bg-white p-4 shadow-soft dark:bg-card">
              <h2 className="mb-3 text-2xl font-semibold leading-tight">Document Upload</h2>

              {context && (
                <div className="flex items-center gap-3 border-t pt-3">
                  {context.type === "athlete" ? (
                    <>
                      <img
                        src={context.photo || "/placeholder.svg"}
                        alt={context.name}
                        className="h-8 w-8 rounded-full border object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{context.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            Basketball
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Beneficiary pre-selected • Sponsor will be extracted
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <img
                        src={context.logo || "/placeholder.svg"}
                        alt={context.name}
                        className="h-8 w-8 rounded-lg border bg-white object-cover p-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{context.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Sponsor pre-selected • Athlete will be extracted
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <motion.div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-2xl border-2 border-dashed p-8 transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/5 shadow-strong"
                  : "border-border bg-white shadow-soft hover:border-primary hover:shadow-medium dark:bg-card"
              }`}
            >
              <input type="file" id="file-upload" className="hidden" accept=".pdf,.docx" onChange={handleFileInput} />

              <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center gap-4">
                <motion.div
                  animate={{
                    y: isDragging ? -10 : [0, -8, 0],
                    scale: isDragging ? 1.1 : 1,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isDragging ? 0 : Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className={`rounded-full p-5 transition-colors ${isDragging ? "bg-primary/10" : "bg-muted"}`}
                >
                  <Upload className="h-10 w-10 text-primary" strokeWidth={1.5} />
                </motion.div>

                <div className="text-center">
                  <p className="mb-1 text-lg font-semibold leading-tight">Drop your contract here or click to browse</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Supports PDF and DOCX files up to 10MB
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">PDF</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5">
                    <FileCheck className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">DOCX</span>
                  </div>
                </div>

                <Button size="lg" className="mt-2" type="button">
                  <FileText className="mr-2 h-5 w-5" />
                  Select File
                </Button>
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
              <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span>Bank-grade encryption</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Panel - What We'll Analyze */}
        <div className="flex w-[55%] items-start justify-center bg-muted/30 p-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-xl"
          >
            <h2 className="mb-6 text-2xl font-semibold leading-tight">What We'll Analyze</h2>

            <div className="space-y-4">
              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer rounded-2xl border bg-white p-6 shadow-soft hover:shadow-medium dark:bg-card"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-green-100 p-2.5 dark:bg-green-900/30">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">Compliance Review</h3>
                </div>
                <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
                  Identify regulatory requirements, policy conflicts, and governance issues
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                    <span>Regulatory compliance checks</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                    <span>Policy conflict detection</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span>Critical issue identification</span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer rounded-2xl border bg-white p-6 shadow-soft hover:shadow-medium dark:bg-card"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold leading-tight">Payment Extraction</h3>
                </div>
                <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
                  Extract payment obligations, schedules, and trigger conditions
                </p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Payment dates and amounts</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Milestone-based triggers</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>Beneficiary identification</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
