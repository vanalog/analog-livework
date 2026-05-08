"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "sonner";
import { Pencil, Trash2, Check, X, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSports } from "@/lib/hooks/use-data";
import {
  createSport,
  updateSport,
  deleteSport,
  countAthletesBySport,
} from "@/lib/data/taxonomy";
import type { Sport } from "@/types/database";

function toSportKey(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "_")
    .replace(/^_+|_+$/g, "");
}

export function SportsManager() {
  const { data: sports, isLoading } = useSports();
  const { mutate } = useSWRConfig();

  const [newLabel, setNewLabel] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Sport | null>(null);
  const [deleteUsage, setDeleteUsage] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const label = newLabel.trim();
    if (!label) return;
    const key = toSportKey(label);
    if (!key) {
      toast.error("Please enter a valid sport name");
      return;
    }
    if ((sports ?? []).some((s) => s.key === key)) {
      toast.error("A sport with that name already exists");
      return;
    }
    setIsCreating(true);
    try {
      await createSport({
        key,
        label,
        sort_order: 500,
      });
      await mutate("sports");
      setNewLabel("");
      toast.success(`Added "${label}"`);
    } catch (err) {
      console.error("[v0] createSport failed:", err);
      toast.error("Could not add sport");
    } finally {
      setIsCreating(false);
    }
  }

  function startEdit(sport: Sport) {
    setEditingId(sport.id);
    setEditLabel(sport.label);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditLabel("");
  }

  async function saveEdit(sport: Sport) {
    const label = editLabel.trim();
    if (!label || label === sport.label) {
      cancelEdit();
      return;
    }
    setIsSavingEdit(true);
    try {
      await updateSport(sport.id, { label });
      await mutate("sports");
      toast.success("Sport updated");
      cancelEdit();
    } catch (err) {
      console.error("[v0] updateSport failed:", err);
      toast.error("Could not update sport");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function askDelete(sport: Sport) {
    setPendingDelete(sport);
    setDeleteUsage(null);
    try {
      const count = await countAthletesBySport(sport.key);
      setDeleteUsage(count);
    } catch (err) {
      console.error("[v0] countAthletesBySport failed:", err);
      setDeleteUsage(0);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteSport(pendingDelete.id);
      await mutate("sports");
      toast.success(`Removed "${pendingDelete.label}"`);
      setPendingDelete(null);
      setDeleteUsage(null);
    } catch (err) {
      console.error("[v0] deleteSport failed:", err);
      toast.error("Could not delete sport");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sports</CardTitle>
          <p className="text-xs text-muted-foreground text-pretty">
            The stable key for each sport is kept when you rename the label, so
            existing athlete records stay linked.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleCreate}
            className="flex items-end gap-2 border-b pb-4"
          >
            <div className="flex-1 space-y-1">
              <Label htmlFor="new-sport" className="text-xs">
                Add a sport
              </Label>
              <Input
                id="new-sport"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="e.g., Beach Volleyball"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={isCreating || !newLabel.trim()}
            >
              {isCreating ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              Add
            </Button>
          </form>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 animate-spin text-muted-foreground" />
            </div>
          ) : (sports ?? []).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No sports defined yet.
            </p>
          ) : (
            <ul className="divide-y">
              {(sports ?? []).map((sport) => {
                const isEditing = editingId === sport.id;
                return (
                  <li
                    key={sport.id}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <Input
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEdit(sport);
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              cancelEdit();
                            }
                          }}
                          autoFocus
                          className="h-8"
                        />
                      ) : (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {sport.label}
                          </span>
                          <code className="text-[11px] text-muted-foreground">
                            {sport.key}
                          </code>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => saveEdit(sport)}
                            disabled={isSavingEdit}
                            aria-label="Save"
                          >
                            <Check className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={cancelEdit}
                            aria-label="Cancel"
                          >
                            <X className="size-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => startEdit(sport)}
                            aria-label="Edit"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => askDelete(sport)}
                            aria-label="Delete"
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &ldquo;{pendingDelete?.label}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteUsage === null ? (
                "Checking current usage..."
              ) : deleteUsage === 0 ? (
                "No athletes are using this sport. Safe to delete."
              ) : (
                <>
                  <strong>{deleteUsage}</strong>{" "}
                  {deleteUsage === 1 ? "athlete is" : "athletes are"} currently
                  assigned to this sport. Deleting it will remove it from the
                  dropdown but those records will keep their existing sport
                  value until reassigned.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting || deleteUsage === null}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
