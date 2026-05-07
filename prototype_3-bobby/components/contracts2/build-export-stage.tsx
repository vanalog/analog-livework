"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Download,
  Upload,
  FileText,
  Check,
} from "lucide-react"
import { useBuildContract } from "@/lib/build-contract-context"
import { BuildStageProgress } from "./build-stage-progress"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function formatDate(iso: string) {
  if (!iso) return "\u2014"
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

function formatDateFull(iso: string) {
  if (!iso) return "\u2014"
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

// Get cap periods covered from payments (fiscal year runs July 1 - June 30)
function getCapPeriodsCovered(payments: { fiscalYear: string }[]): string {
  const years = new Set(payments.map(p => p.fiscalYear))
  const sorted = Array.from(years).sort()
  if (sorted.length === 0) return "None"
  
  // Convert fiscal year (e.g., "FY26") to cap period format (e.g., "Jul '25 - Jun '26")
  const formatCapPeriod = (fy: string) => {
    const yearNum = parseInt(fy.replace("FY", ""), 10)
    const startYear = yearNum - 1
    const endYear = yearNum
    return `Jul '${startYear.toString().slice(-2)} - Jun '${endYear.toString().slice(-2)}`
  }
  
  if (sorted.length === 1) return formatCapPeriod(sorted[0])
  return `${formatCapPeriod(sorted[0])} to ${formatCapPeriod(sorted[sorted.length - 1])}`
}

interface BuildExportStageProps {
  onBack?: () => void
  onCancel?: () => void
  onComplete: () => void
}

export function BuildExportStage({ onBack, onCancel, onComplete }: BuildExportStageProps) {
  const { state, setStage } = useBuildContract()
  const { formData, payments, obligations, scheduleTotal } = state

  const [template, setTemplate] = useState(formData.contractType === "ioi" ? "bsg-ioi" : "bsg-nil")
  const [includePaymentSchedule, setIncludePaymentSchedule] = useState(true)
  const [includeConditionalPayments, setIncludeConditionalPayments] = useState(true)
  const [includeObligationSchedule, setIncludeObligationSchedule] = useState(true)
  const [customUploadFile, setCustomUploadFile] = useState<File | null>(null)

  const contractTypeLabel = formData.contractType === "revenue-share" 
    ? "Revenue Share" 
    : formData.contractType === "ioi" 
      ? "NIL Indication of Interest" 
      : "NIL Sponsorship"
  const capPeriodsCovered = getCapPeriodsCovered(payments)
  
  const isIoi = formData.contractType === "ioi"

  const handleDownloadContract = () => {
    // In production, this would generate and download the .docx file
    alert("Download Contract (.docx) - This would generate the contract document in production.")
    onComplete()
  }

  const handleExportCSV = () => {
    // In production, this would export schedules as CSV
    alert("Export Schedules Only (.csv) - This would export the schedules in production.")
  }

  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCustomUploadFile(e.target.files[0])
    }
  }

  // IOI-specific export view
  if (isIoi) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-4rem)]">
        {/* Stage progress at top - simplified for IOI */}
        <div className="border-b px-6 py-4">
          <div className="flex items-center gap-1 w-full max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 bg-foreground border-foreground">
                <Check className="w-4 h-4 text-background" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap text-foreground hidden sm:inline">Define</span>
            </div>
            <div className="flex-1 h-px mx-3 min-w-[24px] bg-foreground" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 border-foreground bg-background">
                <Download className="w-3.5 h-3.5 text-foreground" />
              </div>
              <span className="text-xs font-medium whitespace-nowrap text-foreground hidden sm:inline">Export</span>
            </div>
          </div>
        </div>

        {/* IOI Export content */}
        <div className="flex-1 flex justify-center py-8 px-4">
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - IOI Summary */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">IOI Summary</h2>
                  <p className="text-sm text-muted-foreground mt-1">Review the indication of interest details</p>
                </div>

                <div className="space-y-4 p-4 rounded-lg border bg-muted/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Document Type</span>
                    <Badge variant="outline">{contractTypeLabel}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Student Athlete</span>
                    <span className="text-sm font-medium">{formData.athleteName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Company</span>
                    <span className="text-sm font-medium">{formData.counterpartyName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Estimated NIL Value</span>
                    <span className="text-sm font-semibold">{formatCurrency(formData.totalValue)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Agreement Date</span>
                    <span className="text-sm font-medium">{formatDateFull(formData.agreementDate)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column - IOI Template Selection */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Download IOI Document</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Select your IOI template and download the document with athlete and compensation details filled in.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>IOI Template</Label>
                  <Select value={template} onValueChange={setTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bsg-ioi">BSG IOI Template</SelectItem>
                      <SelectItem value="custom">Custom Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Custom upload dropzone */}
                {template === "custom" && (
                  <div className="space-y-2">
                    <div
                      className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors hover:border-primary/50"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground text-center mb-1">
                        {customUploadFile ? customUploadFile.name : "Drag and drop your template or"}
                      </p>
                      <label htmlFor="custom-ioi-upload" className="text-sm font-medium text-foreground cursor-pointer hover:underline">
                        browse
                      </label>
                      <Input
                        type="file"
                        id="custom-ioi-upload"
                        className="hidden"
                        onChange={handleCustomFileUpload}
                        accept=".docx,.doc,.pdf"
                      />
                    </div>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    className="w-full gap-2"
                    size="lg"
                    onClick={handleDownloadContract}
                    disabled={!template || (template === "custom" && !customUploadFile)}
                  >
                    <Download className="w-4 h-4" />
                    Download IOI (.docx)
                  </Button>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-muted-foreground text-center pt-2">
                  This document indicates potential NIL compensation only. Actual NIL activities and payments will be offered through the NIL platform.
                </p>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex items-center justify-between pt-8 mt-8 border-t">
              <Button variant="ghost" onClick={() => setStage("define")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Define
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Standard contract export view
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Stage progress at top */}
      <div className="border-b px-6 py-4">
        <BuildStageProgress currentStage="export" />
      </div>

      {/* Export content */}
      <div className="flex-1 flex justify-center py-8 px-4">
        <div className="w-full max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Summary */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Contract Summary</h2>
                <p className="text-sm text-muted-foreground mt-1">Review before exporting</p>
              </div>

              <div className="space-y-4 p-4 rounded-lg border bg-muted/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Contract Type</span>
                  <Badge variant="outline">{contractTypeLabel}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Athlete</span>
                  <span className="text-sm font-medium">{formData.athleteName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Counterparty</span>
                  <span className="text-sm font-medium">{formData.counterpartyName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="text-sm font-semibold">{formatCurrency(scheduleTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Payment Count</span>
                  <span className="text-sm font-medium">{payments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Date Range</span>
                  <span className="text-sm font-medium">{formatDate(formData.startDate)} – {formatDate(formData.endDate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Cap Periods Covered</span>
                  <span className="text-sm font-medium">{capPeriodsCovered}</span>
                </div>
                {formData.contractType === "nil-sponsorship" && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Obligations Count</span>
                    <span className="text-sm font-medium">{obligations.length}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Export Options */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Add schedules to your contract template</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Select your conference template. Analog will insert the payment schedule and obligation schedule into the appropriate sections.
                </p>
              </div>

              <div className="space-y-2">
                <Label>NIL Contract Template</Label>
                <Select value={template} onValueChange={setTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bsg-nil">BSG NIL Template</SelectItem>
                    <SelectItem value="big-ten-nil">Big Ten NIL Template</SelectItem>
                    <SelectItem value="mac-nil">MAC NIL Template</SelectItem>
                    <SelectItem value="sec-nil">SEC NIL Template</SelectItem>
                    <SelectItem value="custom">Custom Upload</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom upload dropzone */}
              {template === "custom" && (
                <div className="space-y-2">
                  <div
                    className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors hover:border-primary/50"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center mb-1">
                      {customUploadFile ? customUploadFile.name : "Drag and drop your template or"}
                    </p>
                    <label htmlFor="custom-template-upload" className="text-sm font-medium text-foreground cursor-pointer hover:underline">
                      browse
                    </label>
                    <Input
                      type="file"
                      id="custom-template-upload"
                      className="hidden"
                      onChange={handleCustomFileUpload}
                      accept=".docx,.doc"
                    />
                  </div>
                </div>
              )}

              {/* Include checkboxes */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="includePayment"
                    checked={includePaymentSchedule}
                    onCheckedChange={(checked) => setIncludePaymentSchedule(checked === true)}
                  />
                  <Label htmlFor="includePayment" className="font-normal cursor-pointer">
                    Include Payment Schedule
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="includeConditional"
                    checked={includeConditionalPayments}
                    onCheckedChange={(checked) => setIncludeConditionalPayments(checked === true)}
                  />
                  <Label htmlFor="includeConditional" className="font-normal cursor-pointer">
                    Include Conditional Payments
                  </Label>
                </div>
                {formData.contractType === "nil-sponsorship" && (
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id="includeObligation"
                      checked={includeObligationSchedule}
                      onCheckedChange={(checked) => setIncludeObligationSchedule(checked === true)}
                    />
                    <Label htmlFor="includeObligation" className="font-normal cursor-pointer">
                      Include Obligation Schedule
                    </Label>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="space-y-3 pt-4">
                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={handleDownloadContract}
                  disabled={!template || (template === "custom" && !customUploadFile)}
                >
                  <Download className="w-4 h-4" />
                  Download Contract (.docx)
                </Button>
                <button
                  onClick={handleExportCSV}
                  className="w-full text-sm text-muted-foreground hover:text-foreground hover:underline transition-colors text-center"
                >
                  Export Schedules Only (.csv)
                </button>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground text-center pt-2">
                Analog inserts schedules only. Legal terms are governed by your conference template.
              </p>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-8 mt-8 border-t">
            <Button variant="ghost" onClick={onBack || (() => setStage("review"))} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Review
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
