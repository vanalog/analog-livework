"use client"

import { SheetTrigger } from "@/components/ui/sheet"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Search, Filter, Plus, Eye, MoreVertical, Download, Upload, Info, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface EntityManagementProps {
  entityType: "Athletes" | "Sponsors" | "Universities"
}

const mockEntities = {
  Athletes: [
    {
      id: 1,
      name: "Marcus Johnson",
      email: "marcus.j@example.com",
      entityType: "Athlete",
      kycStatus: "verified",
      linkedContracts: 3,
      university: "University of Kentucky",
      sport: "Men's Basketball",
      verificationDate: "2024-01-15",
      invitationSent: "2024-01-10",
      invitationAccepted: "2024-01-12",
    },
    {
      id: 2,
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      entityType: "Athlete",
      kycStatus: "pending",
      linkedContracts: 1,
      university: "UCLA",
      sport: "Soccer",
      verificationDate: null,
      invitationSent: "2024-02-01",
      invitationAccepted: "2024-02-03",
    },
    {
      id: 3,
      name: "David Chen",
      email: "david.c@example.com",
      entityType: "Athlete",
      kycStatus: "invited",
      linkedContracts: 0,
      university: "Stanford",
      sport: "Swimming",
      verificationDate: null,
      invitationSent: "2024-02-20",
      invitationAccepted: null,
    },
  ],
  Sponsors: [
    {
      id: 1,
      name: "Nike Inc.",
      entityType: "Corporate Sponsor",
      kycStatus: "verified",
      linkedContracts: 15,
      industry: "Sportswear",
      tier: "Tier 1",
    },
    {
      id: 2,
      name: "Local Auto Dealership",
      entityType: "Local Business",
      kycStatus: "pending",
      linkedContracts: 2,
      industry: "Automotive",
      tier: "Tier 3",
    },
    {
      id: 3,
      name: "Adidas",
      entityType: "Corporate Sponsor",
      kycStatus: "verified",
      linkedContracts: 12,
      industry: "Sportswear",
      tier: "Tier 1",
    },
  ],
  Universities: [
    {
      id: 1,
      name: "University of Kentucky",
      entityType: "Public University",
      kycStatus: "verified",
      linkedContracts: 45,
      conference: "SEC",
      state: "Kentucky",
    },
    {
      id: 2,
      name: "UCLA",
      entityType: "Public University",
      kycStatus: "verified",
      linkedContracts: 38,
      conference: "Pac-12",
      state: "California",
    },
    {
      id: 3,
      name: "Stanford University",
      entityType: "Private University",
      kycStatus: "verified",
      linkedContracts: 22,
      conference: "Pac-12",
      state: "California",
    },
  ],
}

export function EntityManagement({ entityType }: EntityManagementProps) {
  const router = useRouter()
  const [selectedEntity, setSelectedEntity] = useState<any>(null)
  const [athleteSheetOpen, setAthleteSheetOpen] = useState(false)
  const [addAthleteOpen, setAddAthleteOpen] = useState(false)
  const [importAthletesOpen, setImportAthletesOpen] = useState(false)
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResult, setUploadResult] = useState<{ success: number; failed: number } | null>(null)
  const { toast } = useToast()

  const entities = mockEntities[entityType]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "default"
      case "invited":
        return "outline"
      case "registered":
      case "pending":
        return "secondary"
      case "manual_review":
        return "warning"
      case "denied":
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case "verified":
        return "Identity verified and account active"
      case "invited":
        return "Invitation sent, awaiting athlete response"
      case "pending":
        return "Verification in progress"
      case "manual_review":
        return "Requires manual review by compliance team"
      case "denied":
        return "Verification denied, account blocked"
      default:
        return status
    }
  }

  const handleAddAthlete = () => {
    if (!athleteForm.email || !athleteForm.firstName || !athleteForm.lastName) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invitation Sent",
      description: `Invitation email sent to ${athleteForm.email}`,
    })

    setAddAthleteOpen(false)
    setAthleteForm({ email: "", firstName: "", lastName: "", sport: "", graduationYear: "" })
  }

  const handleFileUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      })
      return
    }

    setUploadResult({ success: 15, failed: 2 })
    toast({
      title: "Import Complete",
      description: "Athletes have been imported successfully",
    })
  }

  const handleDownloadTemplate = () => {
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded",
    })
  }

  const handleDownloadErrorReport = () => {
    toast({
      title: "Error Report Downloaded",
      description: "CSV error report has been downloaded",
    })
  }

  const handleViewImportedAthletes = () => {
    setImportAthletesOpen(false)
    toast({
      title: "Showing Imported Athletes",
      description: "Table updated to show newly imported athletes",
    })
  }

  const handleResendInvitation = (entity: any) => {
    toast({
      title: "Invitation Resent",
      description: `Invitation email resent to ${entity.email}`,
    })
  }

  const handleAthleteClick = (athlete: any) => {
    router.push(`/beneficiaries/${athlete.id}`)
  }

  const handleContractsClick = (athleteId: number) => {
    window.location.href = `/contracts?beneficiary=${athleteId}`
  }

  const handleManageVerification = (entity: any) => {
    setSelectedEntity(entity)
    setVerificationDialogOpen(true)
  }

  const currentYear = new Date().getFullYear()
  const graduationYears = Array.from({ length: 7 }, (_, i) => currentYear + i)

  const [athleteForm, setAthleteForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    sport: "",
    graduationYear: "",
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{entityType}</h1>
          <p className="text-muted-foreground">Manage {entityType.toLowerCase()} and their verification status</p>
        </div>
        <div className="flex gap-2">
          {entityType === "Athletes" && (
            <>
              <Dialog open={importAthletesOpen} onOpenChange={setImportAthletesOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 bg-transparent">
                    <Upload className="w-4 h-4" />
                    Import Athletes
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Import Athletes</DialogTitle>
                    <DialogDescription>Upload a CSV file to import multiple athletes at once</DialogDescription>
                  </DialogHeader>
                  <Tabs defaultValue="download" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="download">Download Template</TabsTrigger>
                      <TabsTrigger value="upload">Upload CSV</TabsTrigger>
                    </TabsList>
                    <TabsContent value="download" className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Download the CSV template to see the required format for importing athletes.
                      </p>
                      <Button onClick={handleDownloadTemplate} className="gap-2">
                        <Download className="w-4 h-4" />
                        Download CSV Template
                      </Button>
                    </TabsContent>
                    <TabsContent value="upload" className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="csv-file">Select CSV File</Label>
                        <Input
                          id="csv-file"
                          type="file"
                          accept=".csv"
                          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        />
                        {selectedFile && <p className="text-sm text-muted-foreground">Selected: {selectedFile.name}</p>}
                      </div>
                      {uploadResult && (
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            <div className="space-y-2">
                              <p>
                                Successfully imported {uploadResult.success} athletes.{" "}
                                {uploadResult.failed > 0 && `${uploadResult.failed} failed.`}
                              </p>
                              <div className="flex gap-4">
                                <Button variant="link" className="p-0 h-auto" onClick={handleViewImportedAthletes}>
                                  View imported athletes
                                </Button>
                                {uploadResult.failed > 0 && (
                                  <Button variant="link" className="p-0 h-auto" onClick={handleDownloadErrorReport}>
                                    Download error report
                                  </Button>
                                )}
                              </div>
                            </div>
                          </AlertDescription>
                        </Alert>
                      )}
                      <Button onClick={handleFileUpload} disabled={!selectedFile}>
                        Upload
                      </Button>
                    </TabsContent>
                  </Tabs>
                </DialogContent>
              </Dialog>

              <Dialog open={addAthleteOpen} onOpenChange={setAddAthleteOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Athlete
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Athlete</DialogTitle>
                    <DialogDescription>
                      Add a new athlete to the platform. They will receive an invitation email to complete their
                      registration.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        Once added, the athlete will receive an email with instructions to create their account and
                        complete identity verification. They will access their information at athlete.analogplatform.com
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="athlete@example.com"
                        value={athleteForm.email}
                        onChange={(e) => setAthleteForm({ ...athleteForm, email: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">
                          First Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={athleteForm.firstName}
                          onChange={(e) => setAthleteForm({ ...athleteForm, firstName: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">
                          Last Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={athleteForm.lastName}
                          onChange={(e) => setAthleteForm({ ...athleteForm, lastName: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sport">Sport</Label>
                      <Select
                        value={athleteForm.sport}
                        onValueChange={(value) => setAthleteForm({ ...athleteForm, sport: value })}
                      >
                        <SelectTrigger id="sport">
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basketball">Basketball</SelectItem>
                          <SelectItem value="football">Football</SelectItem>
                          <SelectItem value="soccer">Soccer</SelectItem>
                          <SelectItem value="baseball">Baseball</SelectItem>
                          <SelectItem value="swimming">Swimming</SelectItem>
                          <SelectItem value="track">Track & Field</SelectItem>
                          <SelectItem value="volleyball">Volleyball</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year</Label>
                      <Select
                        value={athleteForm.graduationYear}
                        onValueChange={(value) => setAthleteForm({ ...athleteForm, graduationYear: value })}
                      >
                        <SelectTrigger id="graduationYear">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          {graduationYears.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAddAthleteOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddAthlete}>Send Invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
          {entityType !== "Athletes" && (
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add {entityType.slice(0, -1)}
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder={`Search ${entityType.toLowerCase()}...`} className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="KYC Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {entityType === "Athletes" && <TableHead>Email</TableHead>}
                  {entityType !== "Athletes" && <TableHead>Entity Type</TableHead>}
                  {entityType === "Athletes" && <TableHead>Sport</TableHead>}
                  <TableHead>Status</TableHead>
                  {entityType === "Athletes" && <TableHead>Verification Date</TableHead>}
                  <TableHead>Linked Contracts</TableHead>
                  {entityType !== "Athletes" && <TableHead>Additional Info</TableHead>}
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entities.map((entity) => (
                  <TableRow
                    key={entity.id}
                    className={entityType === "Athletes" ? "hover:bg-muted/50 cursor-pointer" : ""}
                    onClick={() => entityType === "Athletes" && handleAthleteClick(entity)}
                  >
                    <TableCell className="font-medium">{entity.name}</TableCell>
                    {entityType === "Athletes" && <TableCell>{(entity as any).email}</TableCell>}
                    {entityType !== "Athletes" && <TableCell>{entity.entityType}</TableCell>}
                    {entityType === "Athletes" && <TableCell>{(entity as any).sport}</TableCell>}
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge variant={getStatusColor(entity.kycStatus)}>{entity.kycStatus}</Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getStatusDescription(entity.kycStatus)}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    {entityType === "Athletes" && (
                      <TableCell>
                        {(entity as any).verificationDate
                          ? new Date((entity as any).verificationDate).toLocaleDateString()
                          : "-"}
                      </TableCell>
                    )}
                    <TableCell>
                      {entityType === "Athletes" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 p-0 h-auto font-normal"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleContractsClick(entity.id)
                          }}
                        >
                          {entity.linkedContracts}
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      ) : (
                        entity.linkedContracts
                      )}
                    </TableCell>
                    {entityType !== "Athletes" && (
                      <TableCell className="text-sm text-muted-foreground">
                        {entityType === "Sponsors" && `${(entity as any).industry} • ${(entity as any).tier}`}
                        {entityType === "Universities" && `${(entity as any).conference} • ${(entity as any).state}`}
                      </TableCell>
                    )}
                    <TableCell>
                      {entityType === "Athletes" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAthleteClick(entity)
                              }}
                            >
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleResendInvitation(entity)
                              }}
                            >
                              Resend Invitation
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                handleManageVerification(entity)
                              }}
                            >
                              Manage Verification
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => setSelectedEntity(entity)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>{selectedEntity?.name}</SheetTitle>
                              <SheetDescription>
                                {entityType.slice(0, -1)} profile and verification details
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Basic Information</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Entity Type:</span>
                                    <span>{selectedEntity?.entityType}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">KYC Status:</span>
                                    <Badge variant={getStatusColor(selectedEntity?.kycStatus)}>
                                      {selectedEntity?.kycStatus}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-muted-foreground">Linked Contracts:</span>
                                    <span>{selectedEntity?.linkedContracts}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Additional Details</h4>
                                <div className="space-y-2 text-sm">
                                  {entityType === "Sponsors" && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Industry:</span>
                                        <span>{(selectedEntity as any)?.industry}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Tier:</span>
                                        <span>{(selectedEntity as any)?.tier}</span>
                                      </div>
                                    </>
                                  )}
                                  {entityType === "Universities" && (
                                    <>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">Conference:</span>
                                        <span>{(selectedEntity as any)?.conference}</span>
                                      </div>
                                      <div className="flex justify-between">
                                        <span className="text-muted-foreground">State:</span>
                                        <span>{(selectedEntity as any)?.state}</span>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="pt-4 space-y-2">
                                <Button className="w-full">Edit Profile</Button>
                                <Button variant="outline" className="w-full bg-transparent">
                                  View Contracts
                                </Button>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TooltipProvider>
        </CardContent>
      </Card>

      {/* Removed athleteSheetOpen sheet for athletes as it's no longer needed */}

      <Dialog open={verificationDialogOpen} onOpenChange={setVerificationDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Verification</DialogTitle>
            <DialogDescription>Manage verification status for {selectedEntity?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Current Status</Label>
              <div className="flex items-center gap-2">
                <Badge variant={getStatusColor(selectedEntity?.kycStatus)}>{selectedEntity?.kycStatus}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Verification Actions</Label>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Request Additional Documents
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Schedule Video Verification
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  View Verification History
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  Send Verification Reminder
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setVerificationDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
