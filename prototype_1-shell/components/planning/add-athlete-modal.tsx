"use client"

import { useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, User, Check } from "lucide-react"
import { cn } from "@/lib/utils"

// Mock existing athletes (would come from backend in real app)
const EXISTING_ATHLETES = [
  { id: "osu-001", name: "Darius Thornton", sport: "Football", position: "WR", graduatingYear: 2027 },
  { id: "osu-002", name: "Malik Crawford", sport: "Football", position: "QB", graduatingYear: 2026 },
  { id: "osu-003", name: "Jaylen Porter", sport: "Basketball", position: "PF", graduatingYear: 2026 },
  { id: "osu-004", name: "Terrance Mitchell", sport: "Football", position: "WR", graduatingYear: 2026 },
  { id: "osu-005", name: "Brandon Hayes", sport: "Football", position: "DE", graduatingYear: 2026 },
  { id: "osu-006", name: "Kevin Moore", sport: "Basketball", position: "SG", graduatingYear: 2027 },
  { id: "osu-007", name: "Andre Wilson", sport: "Basketball", position: "C", graduatingYear: 2028 },
  { id: "osu-008", name: "James Thompson", sport: "Basketball", position: "PG", graduatingYear: 2027 },
  { id: "osu-009", name: "Sarah Johnson", sport: "Basketball", position: "PG", graduatingYear: 2027 },
  { id: "osu-010", name: "Maya Williams", sport: "Basketball", position: "SF", graduatingYear: 2026 },
  { id: "osu-011", name: "Lisa Chen", sport: "Basketball", position: "SG", graduatingYear: 2028 },
  { id: "osu-012", name: "Alexis Davis", sport: "Basketball", position: "PF", graduatingYear: 2027 },
]

interface AddAthleteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (athlete: { id: string; name: string; position: string; graduatingYear: number }) => void
  teamId: string
  existingAthleteIds: string[]
}

export function AddAthleteModal({ 
  open, 
  onOpenChange, 
  onAdd, 
  teamId, 
  existingAthleteIds 
}: AddAthleteModalProps) {
  const [mode, setMode] = useState<"search" | "create">("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAthlete, setSelectedAthlete] = useState<typeof EXISTING_ATHLETES[0] | null>(null)
  
  // New athlete form
  const [newName, setNewName] = useState("")
  const [newPosition, setNewPosition] = useState("")
  const [newYear, setNewYear] = useState("")

  // Filter athletes based on search and exclude those already on roster
  const filteredAthletes = useMemo(() => {
    return EXISTING_ATHLETES.filter(athlete => {
      // Exclude athletes already on this roster
      if (existingAthleteIds.includes(athlete.id)) return false
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          athlete.name.toLowerCase().includes(query) ||
          athlete.position.toLowerCase().includes(query) ||
          athlete.sport.toLowerCase().includes(query)
        )
      }
      return true
    })
  }, [searchQuery, existingAthleteIds])

  const handleAdd = () => {
    if (mode === "search" && selectedAthlete) {
      onAdd({
        id: selectedAthlete.id,
        name: selectedAthlete.name,
        position: selectedAthlete.position,
        graduatingYear: selectedAthlete.graduatingYear,
      })
    } else if (mode === "create" && newName && newPosition && newYear) {
      onAdd({
        id: `new-${Date.now()}`,
        name: newName,
        position: newPosition,
        graduatingYear: parseInt(newYear, 10),
      })
    }
    
    // Reset state
    setSearchQuery("")
    setSelectedAthlete(null)
    setNewName("")
    setNewPosition("")
    setNewYear("")
    setMode("search")
  }

  const handleClose = () => {
    setSearchQuery("")
    setSelectedAthlete(null)
    setNewName("")
    setNewPosition("")
    setNewYear("")
    setMode("search")
    onOpenChange(false)
  }

  const canAdd = mode === "search" 
    ? selectedAthlete !== null 
    : newName.trim() !== "" && newPosition !== "" && newYear !== ""

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Athlete to Roster</DialogTitle>
          <DialogDescription>
            Search for an existing athlete or create a new one.
          </DialogDescription>
        </DialogHeader>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={mode === "search" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("search")}
            className="flex-1"
          >
            <Search className="h-4 w-4 mr-2" />
            Find Existing
          </Button>
          <Button
            variant={mode === "create" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("create")}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>

        {mode === "search" ? (
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, position, or sport..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Athletes List */}
            <ScrollArea className="h-[250px] rounded-md border">
              <div className="p-2 space-y-1">
                {filteredAthletes.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground">
                    <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No athletes found</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      onClick={() => setMode("create")}
                      className="mt-2"
                    >
                      Create a new athlete
                    </Button>
                  </div>
                ) : (
                  filteredAthletes.map((athlete) => (
                    <button
                      key={athlete.id}
                      onClick={() => setSelectedAthlete(athlete)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                        selectedAthlete?.id === athlete.id
                          ? "bg-primary/10 border border-primary"
                          : "hover:bg-muted border border-transparent"
                      )}
                    >
                      <div>
                        <p className="font-medium text-foreground">{athlete.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {athlete.sport} · {athlete.position} · Class of {athlete.graduatingYear}
                        </p>
                      </div>
                      {selectedAthlete?.id === athlete.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="e.g. John Smith"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select value={newPosition} onValueChange={setNewPosition}>
                  <SelectTrigger id="position">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PG">Point Guard (PG)</SelectItem>
                    <SelectItem value="SG">Shooting Guard (SG)</SelectItem>
                    <SelectItem value="SF">Small Forward (SF)</SelectItem>
                    <SelectItem value="PF">Power Forward (PF)</SelectItem>
                    <SelectItem value="C">Center (C)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Graduating Year</Label>
                <Select value={newYear} onValueChange={setNewYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2026">2026</SelectItem>
                    <SelectItem value="2027">2027</SelectItem>
                    <SelectItem value="2028">2028</SelectItem>
                    <SelectItem value="2029">2029</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!canAdd}>
            {mode === "search" ? "Add to Roster" : "Create & Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
