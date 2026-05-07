"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, FileText, CheckCircle2, Shield, DollarSign, CheckCircle } from "lucide-react"
import { ContractProcessing } from "@/components/contract-processing"
import { PartiesResolution } from "@/components/parties-resolution"

interface ContractUploadFormProps {
  athleteId?: string
  sponsorId?: string
  type?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ContractUploadForm({ athleteId, sponsorId, type, onSuccess, onCancel }: ContractUploadFormProps) {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [showPartiesResolution, setShowPartiesResolution] = useState(false)

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUploadClick = () => {
    if (selectedFile) {
      setIsProcessing(true)
    }
  }

  const handleProcessingComplete = (success: boolean, error?: string) => {
    setIsProcessing(false)
    if (success) {
      setUploadComplete(true)
      // Call onSuccess after a brief delay to show success state
      setTimeout(() => {
        onSuccess?.()
      }, 2000)
    }
  }

  const handleProcessingCancel = () => {
    setIsProcessing(false)
    setSelectedFile(null)
  }

  const handleContinueInBackground = () => {
    setIsProcessing(false)
    onSuccess?.()
  }

  const handlePartiesResolution = () => {
    setIsProcessing(false)
    setShowPartiesResolution(true)
  }

  const handlePartiesComplete = () => {
    setShowPartiesResolution(false)
    setUploadComplete(true)
    setTimeout(() => {
      onSuccess?.()
    }, 2000)
  }

  const handlePartiesBack = () => {
    setShowPartiesResolution(false)
    setSelectedFile(null)
  }

  if (uploadComplete) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Contract Uploaded Successfully!</h3>
              <p className="text-sm text-muted-foreground">The contract has been processed and is now under review.</p>
            </div>
            <Button onClick={onSuccess}>View Contract</Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (showPartiesResolution && selectedFile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Link Contract Parties</CardTitle>
          <CardDescription>
            We've identified the following parties in the contract. Please link them to existing records or create new
            ones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PartiesResolution
            fileName={selectedFile.name}
            onComplete={handlePartiesComplete}
            onBack={handlePartiesBack}
          />
        </CardContent>
      </Card>
    )
  }

  if (isProcessing && selectedFile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <ContractProcessing
            fileName={selectedFile.name}
            onComplete={handleProcessingComplete}
            onCancel={handleProcessingCancel}
            onContinueInBackground={handleContinueInBackground}
            onPartiesResolution={handlePartiesResolution}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Column - Document Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Document Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-12 flex flex-col items-center justify-center transition-colors min-h-[320px] ${
              dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              Drop your contract here or{" "}
              <label htmlFor="file-upload" className="text-primary cursor-pointer hover:underline">
                click to browse
              </label>
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Supports PDF and DOCX files up to 10MB</p>

            {/* File Type Badges */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-1.5 border rounded-md bg-background">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">PDF</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 border rounded-md bg-background">
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">DOCX</span>
              </div>
            </div>

            {/* Select File Button */}
            <Button variant="outline" size="lg" asChild>
              <label htmlFor="file-upload" className="cursor-pointer">
                <FileText className="w-4 h-4 mr-2" />
                Select File
              </label>
            </Button>

            <Input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileInputChange}
              accept=".pdf,.docx"
            />
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                Remove
              </Button>
            </div>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Bank-grade encryption</span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={handleUploadClick} disabled={!selectedFile}>
              Upload & Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Right Column - What We'll Analyze */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">What We'll Analyze</h2>
        </div>

        {/* Compliance Review Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">Compliance Review</CardTitle>
                <CardDescription className="text-base">
                  Identify regulatory requirements, policy conflicts, and governance issues
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Regulatory compliance checks
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Policy conflict detection
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Critical issue identification
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Payment Extraction Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">Payment Extraction</CardTitle>
                <CardDescription className="text-base">
                  Extract payment obligations, schedules, and trigger conditions
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Payment dates and amounts
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Milestone-based triggers
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                Beneficiary identification
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
