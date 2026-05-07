"use client"

import type React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, X, FileText } from "lucide-react"

interface ContractUploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock athletes data - would come from API in production
const mockAthletes = [
  { id: "1", name: "Marcus Williams", sport: "Football", position: "Quarterback" },
  { id: "2", name: "Tyler Davis", sport: "Football", position: "Wide Receiver" },
  { id: "3", name: "Brandon Smith", sport: "Football", position: "Running Back" },
  { id: "4", name: "Jordan Mitchell", sport: "Football", position: "Linebacker" },
  { id: "5", name: "Chris Thompson", sport: "Football", position: "Defensive End" },
  { id: "6", name: "Devin Harris", sport: "Football", position: "Cornerback" },
  { id: "7", name: "Isaiah Walker", sport: "Football", position: "Safety" },
  { id: "8", name: "Cameron Lee", sport: "Football", position: "Tight End" },
  { id: "9", name: "Jaylen Brown", sport: "Basketball", position: "Guard" },
  { id: "10", name: "Michael Davis", sport: "Basketball", position: "Forward" },
]

const contractTypes = ["Revenue Share", "NIL License Agreement", "Endorsement", "Termination"]
const groupOptions = ["New Recruit", "Transfer", "Retention", "Termination"]
const statusOptions = [
  { value: "drafting", label: "Drafting" },
  { value: "draft-sent", label: "Draft Sent" },
  { value: "in-redlining", label: "In Redlining" },
  { value: "ready-to-sign", label: "Ready to Sign" },
  { value: "executed", label: "Executed" },
]

export function ContractUploadModal({ open, onOpenChange }: ContractUploadModalProps) {
  const [athleteId, setAthleteId] = useState("")
  const [athleteSearch, setAthleteSearch] = useState("")
  const [contractType, setContractType] = useState("")
  const [group, setGroup] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [dragActive, setDragActive] = useState(false)
  const [initialStatus, setInitialStatus] = useState("draft-sent")

  const selectedAthlete = mockAthletes.find((a) => a.id === athleteId)

  const handleAthleteChange = (value: string) => {
    setAthleteId(value)
    const athlete = mockAthletes.find((a) => a.id === value)
    if (athlete) {
      setAthleteSearch(`${athlete.name}`)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const validFiles = Array.from(e.dataTransfer.files).filter((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase()
        return ext === "pdf" || ext === "docx" || ext === "doc"
      })
      setUploadedFiles([...uploadedFiles, ...validFiles])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles = Array.from(e.target.files).filter((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase()
        return ext === "pdf" || ext === "docx" || ext === "doc"
      })
      setUploadedFiles([...uploadedFiles, ...validFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const resetForm = () => {
    setAthleteId("")
    setAthleteSearch("")
    setContractType("")
    setGroup("")
    setUploadedFiles([])
    setInitialStatus("draft-sent")
  }

  const handleUploadContract = () => {
    // Here you would call an API to create the contract
    console.log({
      athleteId,
      contractType,
      group,
      uploadedFiles,
      initialStatus,
    })

    // Close modal and reset form
    onOpenChange(false)
    resetForm()
  }

  const isFormValid = athleteId && contractType && group && initialStatus

  // Filter athletes based on search
  const filteredAthletes = mockAthletes.filter((athlete) =>
    `${athlete.name} - ${athlete.sport}`.toLowerCase().includes(athleteSearch.toLowerCase()),
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Contract</DialogTitle>
          <DialogDescription>
            Add a new contract for review
          </DialogDescription>
          {selectedAthlete && (
            <p className="text-sm text-muted-foreground">
              {selectedAthlete.name} · {selectedAthlete.sport} · {selectedAthlete.position}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Athlete Search Dropdown */}
          <div className="space-y-2">
            <Label>
              Athlete <span className="text-destructive">*</span>
            </Label>
            <Select value={athleteId} onValueChange={handleAthleteChange}>
              <SelectTrigger>
                <SelectValue placeholder="Search athlete..." />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <Input
                    placeholder="Type to search..."
                    value={athleteSearch}
                    onChange={(e) => setAthleteSearch(e.target.value)}
                    className="mb-2"
                  />
                </div>
                {filteredAthletes.map((athlete) => (
                  <SelectItem key={athlete.id} value={athlete.id}>
                    {athlete.name} - {athlete.sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* File Upload Area */}
          <div className="space-y-2">
            <div
              className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <Upload className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground text-center mb-1">
                Drag and drop files here or{" "}
                <label htmlFor="contract-file-upload" className="text-foreground cursor-pointer hover:underline font-semibold">
                  browse
                </label>
              </p>
              <p className="text-xs text-muted-foreground">Accepts .pdf, .docx, .doc (multiple files allowed)</p>
              <Input
                type="file"
                id="contract-file-upload"
                className="hidden"
                onChange={handleFileInputChange}
                accept=".pdf,.docx,.doc"
                multiple
              />
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2 mt-2">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2.5 border rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => removeFile(index)}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contract Type, Group, and Status */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label>
                Contract Type <span className="text-destructive">*</span>
              </Label>
              <Select value={contractType} onValueChange={setContractType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {contractTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Group <span className="text-destructive">*</span>
              </Label>
              <Select value={group} onValueChange={setGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  {groupOptions.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Status <span className="text-destructive">*</span>
              </Label>
              <Select value={initialStatus} onValueChange={setInitialStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { onOpenChange(false); resetForm() }}>
            Cancel
          </Button>
          <Button
            onClick={handleUploadContract}
            disabled={!isFormValid}
            className="bg-foreground text-background hover:bg-foreground/90 gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload Contract
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
