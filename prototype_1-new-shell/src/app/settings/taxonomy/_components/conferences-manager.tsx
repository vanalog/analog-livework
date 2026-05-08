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
import { useConferences } from "@/lib/hooks/use-data";
import {
  createConference,
  renameConference,
  deleteConference,
  countUniversitiesByConference,
} from "@/lib/data/taxonomy";
import type { Conference } from "@/types/database";

export function ConferencesManager() {
  const { data: conferences, isLoading } = useConferences();
  const { mutate } = useSWRConfig();

  const [newName, setNewName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Conference | null>(null);
  const [deleteUsage, setDeleteUsage] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    if (
      (conferences ?? []).some(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      toast.error("A conference with that name already exists");
      return;
    }
    setIsCreating(true);
    try {
      await createConference({
        name,
        sort_order: 500,
      });
      await mutate("conferences");
      setNewName("");
      toast.success(`Added "${name}"`);
    } catch (err) {
      console.error("[v0] createConference failed:", err);
      toast.error("Could not add conference");
    } finally {
      setIsCreating(false);
    }
  }

  function startEdit(conf: Conference) {
    setEditingId(conf.id);
    setEditName(conf.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName("");
  }

  async function saveEdit(conf: Conference) {
    const name = editName.trim();
    if (!name || name === conf.name) {
      cancelEdit();
      return;
    }
    setIsSavingEdit(true);
    try {
      // Rename cascades to all universities currently using the old name.
      await renameConference(conf.id, conf.name, name);
      await mutate("conferences");
      await mutate("universities");
      await mutate("universities-with-stats");
      toast.success("Conference renamed");
      cancelEdit();
    } catch (err) {
      console.error("[v0] renameConference failed:", err);
      toast.error("Could not rename conference");
    } finally {
      setIsSavingEdit(false);
    }
  }

  async function askDelete(conf: Conference) {
    setPendingDelete(conf);
    setDeleteUsage(null);
    try {
      const count = await countUniversitiesByConference(conf.name);
      setDeleteUsage(count);
    } catch (err) {
      console.error("[v0] countUniversitiesByConference failed:", err);
      setDeleteUsage(0);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setIsDeleting(true);
    try {
      await deleteConference(pendingDelete.id);
      await mutate("conferences");
      toast.success(`Removed "${pendingDelete.name}"`);
      setPendingDelete(null);
      setDeleteUsage(null);
    } catch (err) {
      console.error("[v0] deleteConference failed:", err);
      toast.error("Could not delete conference");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conferences</CardTitle>
          <p className="text-xs text-muted-foreground text-pretty">
            Renaming a conference updates every university currently assigned
            to it.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form
            onSubmit={handleCreate}
            className="flex items-end gap-2 border-b pb-4"
          >
            <div className="flex-1 space-y-1">
              <Label htmlFor="new-conference" className="text-xs">
                Add a conference
              </Label>
              <Input
                id="new-conference"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Big Sky Conference"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              disabled={isCreating || !newName.trim()}
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
          ) : (conferences ?? []).length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No conferences defined yet.
            </p>
          ) : (
            <ul className="divide-y">
              {(conferences ?? []).map((conf) => {
                const isEditing = editingId === conf.id;
                return (
                  <li
                    key={conf.id}
                    className="flex items-center gap-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      {isEditing ? (
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              saveEdit(conf);
                            } else if (e.key === "Escape") {
                              e.preventDefault();
                              cancelEdit();
                            }
                          }}
                          autoFocus
                          className="h-8"
                        />
                      ) : (
                        <span className="text-sm font-medium">
                          {conf.name}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => saveEdit(conf)}
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
                            onClick={() => startEdit(conf)}
                            aria-label="Edit"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            onClick={() => askDelete(conf)}
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
              Delete &ldquo;{pendingDelete?.name}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteUsage === null ? (
                "Checking current usage..."
              ) : deleteUsage === 0 ? (
                "No universities are using this conference. Safe to delete."
              ) : (
                <>
                  <strong>{deleteUsage}</strong>{" "}
                  {deleteUsage === 1 ? "university is" : "universities are"}{" "}
                  currently assigned to this conference. Deleting it will
                  remove it from the dropdown but those records will keep
                  their existing conference value until reassigned.
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
