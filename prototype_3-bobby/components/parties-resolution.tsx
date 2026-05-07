"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { User, Building, X, Search } from "lucide-react"
import { toast } from "sonner"

interface ParsedParty {
  id: string
  name: string
  role: "beneficiary" | "sponsor" | "university" | "other"
  linkedBeneficiaryId?: string
  linkedBeneficiaryName?: string
}

interface Beneficiary {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  dateOfBirth: string
  university: string
  status: "verified" | "in_progress" | "needs_review" | "blocked"
}

interface PartiesResolutionProps {
  fileName: string
  onComplete: () => void
  onBack: () => void
}

const mockParsedParties: ParsedParty[] = [
  {
    id: "1",
    name: "Marcus Johnson",
    role: "beneficiary",
  },
  {
    id: "2",
    name: "Nike Inc.",
    role: "sponsor",
  },
  {
    id: "3",
    name: "University of Kentucky",
    role: "university",
  },
]

const mockBeneficiaries: Beneficiary[] = [
  {
    id: "b1",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus.johnson@uky.edu",
    phone: "(555) 123-4567",
    dateOfBirth: "2003-05-15",
    university: "University of Kentucky",
    status: "verified",
  },
  {
    id: "b2",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@stanford.edu",
    dateOfBirth: "2004-02-22",
    university: "Stanford University",
    status: "in_progress",
  },
  {
    id: "b3",
    firstName: "Alex",
    lastName: "Chen",
    email: "alex.chen@umich.edu",
    dateOfBirth: "2003-11-08",
    university: "University of Michigan",
    status: "needs_review",
  },
]

const universities = [
  "Duke University",
  "Stanford University",
  "University of Michigan",
  "University of Texas",
  "University of Kentucky",
]

export function PartiesResolution({ fileName, onComplete, onBack }: PartiesResolutionProps) {
  const [parties, setParties] = useState<ParsedParty[]>(mockParsedParties)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [editMode, setEditMode] = useState<"search" | "create" | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [newBeneficiary, setNewBeneficiary] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    university: "",
  })

  const getSuggestedMatches = (partyName: string) => {
    const nameParts = partyName.toLowerCase().split(" ")
    return mockBeneficiaries
      .map((b) => {
        const fullName = `${b.firstName} ${b.lastName}`.toLowerCase()
        let confidence = 0

        // Calculate confidence based on name matching
        nameParts.forEach((part) => {
          if (fullName.includes(part)) {
            confidence += part.length > 2 ? 30 : 15
          }
        })

        return { beneficiary: b, confidence }
      })
      .filter((match) => match.confidence > 20)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 1) // Show only the best match
  }

  const getSearchResults = () => {
    if (searchTerm.length < 2) return []

    return mockBeneficiaries.filter(
      (b) =>
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.dateOfBirth.includes(searchTerm),
    )
  }

  const handleLinkBeneficiary = (partyId: string, beneficiary: Beneficiary) => {
    setParties((prev) =>
      prev.map((party) =>
        party.id === partyId
          ? {
              ...party,
              linkedBeneficiaryId: beneficiary.id,
              linkedBeneficiaryName: `${beneficiary.firstName} ${beneficiary.lastName}`,
            }
          : party,
      ),
    )

    toast.success(`Linked to ${beneficiary.firstName} ${beneficiary.lastName}`, {
      action: {
        label: "Undo",
        onClick: () => handleUnlinkBeneficiary(partyId),
      },
    })

    setExpandedRow(null)
    setEditMode(null)
    setSearchTerm("")
  }

  const handleUnlinkBeneficiary = (partyId: string) => {
    setParties((prev) =>
      prev.map((party) =>
        party.id === partyId
          ? {
              ...party,
              linkedBeneficiaryId: undefined,
              linkedBeneficiaryName: undefined,
            }
          : party,
      ),
    )
  }

  const handleCreateBeneficiary = () => {
    const beneficiary: Beneficiary = {
      id: `b${Date.now()}`,
      firstName: newBeneficiary.firstName,
      lastName: newBeneficiary.lastName,
      email: newBeneficiary.email,
      phone: "",
      dateOfBirth: newBeneficiary.dateOfBirth,
      university: newBeneficiary.university,
      status: "needs_review",
    }

    if (expandedRow) {
      handleLinkBeneficiary(expandedRow, beneficiary)
    }

    // Reset form
    setNewBeneficiary({
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      university: "",
    })
  }

  const startLinkExisting = (partyId: string) => {
    setExpandedRow(partyId)
    setEditMode("search")
    setSearchTerm("")
  }

  const startCreateNew = (partyId: string) => {
    setExpandedRow(partyId)
    setEditMode("create")
    setNewBeneficiary({
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      university: "",
    })
  }

  const cancelInlineEdit = () => {
    setExpandedRow(null)
    setEditMode(null)
    setSearchTerm("")
    setNewBeneficiary({
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      university: "",
    })
  }

  const canContinue = () => {
    const beneficiaryParties = parties.filter((p) => p.role === "beneficiary")
    return beneficiaryParties.every((p) => p.linkedBeneficiaryId)
  }

  const handleContinue = () => {
    onComplete()
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Party Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parties.map((party) => {
              const suggestedMatches = party.role === "beneficiary" ? getSuggestedMatches(party.name) : []
              const isExpanded = expandedRow === party.id

              return (
                <>
                  <TableRow key={party.id} className={party.role !== "beneficiary" ? "opacity-60" : ""}>
                    <TableCell className="font-medium">{party.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {party.role === "beneficiary" && <User className="w-3 h-3 mr-1" />}
                        {(party.role === "sponsor" || party.role === "university") && (
                          <Building className="w-3 h-3 mr-1" />
                        )}
                        {party.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {party.linkedBeneficiaryName ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="text-xs">
                            Linked to {party.linkedBeneficiaryName}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleUnlinkBeneficiary(party.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : party.role === "beneficiary" ? (
                        <div className="space-y-2">
                          {!isExpanded && suggestedMatches.length > 0 && (
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="text-sm text-muted-foreground">
                                    Suggested: {suggestedMatches[0].beneficiary.firstName}{" "}
                                    {suggestedMatches[0].beneficiary.lastName}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{suggestedMatches[0].confidence}% confidence</p>
                                </TooltipContent>
                              </Tooltip>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs bg-transparent"
                                onClick={() => handleLinkBeneficiary(party.id, suggestedMatches[0].beneficiary)}
                              >
                                Link
                              </Button>
                            </div>
                          )}
                          {!isExpanded && (
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs bg-transparent"
                                onClick={() => startLinkExisting(party.id)}
                              >
                                Link existing
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs bg-transparent"
                                onClick={() => startCreateNew(party.id)}
                              >
                                Create new
                              </Button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">Auto-linked (editable later)</span>
                      )}
                    </TableCell>
                  </TableRow>
                  {isExpanded && editMode === "search" && (
                    <TableRow>
                      <TableCell colSpan={3} className="p-4 bg-muted/30">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <Input
                              placeholder="Search by name, email, or DOB..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="flex-1"
                            />
                          </div>
                          {getSearchResults().length > 0 && (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {getSearchResults().map((beneficiary) => (
                                <div
                                  key={beneficiary.id}
                                  className="flex items-center justify-between p-2 border rounded"
                                >
                                  <div>
                                    <p className="text-sm font-medium">
                                      {beneficiary.firstName} {beneficiary.lastName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {beneficiary.email} • {beneficiary.university}
                                    </p>
                                  </div>
                                  <Button size="sm" onClick={() => handleLinkBeneficiary(party.id, beneficiary)}>
                                    Link
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={cancelInlineEdit}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                  {isExpanded && editMode === "create" && (
                    <TableRow>
                      <TableCell colSpan={3} className="p-4 bg-muted/30">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="firstName" className="text-xs">
                                First Name
                              </Label>
                              <Input
                                id="firstName"
                                size="sm"
                                value={newBeneficiary.firstName}
                                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, firstName: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="lastName" className="text-xs">
                                Last Name
                              </Label>
                              <Input
                                id="lastName"
                                size="sm"
                                value={newBeneficiary.lastName}
                                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, lastName: e.target.value })}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label htmlFor="email" className="text-xs">
                                Email
                              </Label>
                              <Input
                                id="email"
                                type="email"
                                size="sm"
                                value={newBeneficiary.email}
                                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, email: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="dateOfBirth" className="text-xs">
                                Date of Birth
                              </Label>
                              <Input
                                id="dateOfBirth"
                                type="date"
                                size="sm"
                                value={newBeneficiary.dateOfBirth}
                                onChange={(e) => setNewBeneficiary({ ...newBeneficiary, dateOfBirth: e.target.value })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="university" className="text-xs">
                              University (optional)
                            </Label>
                            <Select
                              value={newBeneficiary.university}
                              onValueChange={(value) => setNewBeneficiary({ ...newBeneficiary, university: value })}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select university" />
                              </SelectTrigger>
                              <SelectContent>
                                {universities.map((university) => (
                                  <SelectItem key={university} value={university}>
                                    {university}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={cancelInlineEdit}>
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={handleCreateBeneficiary}
                              disabled={
                                !newBeneficiary.firstName ||
                                !newBeneficiary.lastName ||
                                !newBeneficiary.email ||
                                !newBeneficiary.dateOfBirth
                              }
                            >
                              Save
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )
            })}
          </TableBody>
        </Table>

        {!canContinue() && (
          <p className="text-sm text-muted-foreground">All Beneficiaries must be linked to continue.</p>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!canContinue()}>
            Continue
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}
