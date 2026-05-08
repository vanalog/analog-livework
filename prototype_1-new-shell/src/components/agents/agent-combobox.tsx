"use client";

import React, { useState } from "react";
import { useSWRConfig } from "swr";
import { useAgents } from "@/lib/hooks/use-data";
import { createAgent } from "@/lib/data";
import { ComboboxInput } from "@/components/core/form/combobox-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

/**
 * Formats a phone number as user types (US format)
 */
function formatPhoneInput(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  
  // Limit to 10 digits
  const limited = digits.slice(0, 10);
  
  // Format based on length
  if (limited.length === 0) return "";
  if (limited.length <= 3) return `(${limited}`;
  if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
  return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
}

interface AgentComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
}

export function AgentCombobox({
  value,
  onChange,
  placeholder = "Select agent...",
  invalid,
}: AgentComboboxProps) {
  const { data: agents, isLoading } = useAgents();
  const { mutate } = useSWRConfig();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentEmail, setNewAgentEmail] = useState("");
  const [newAgentPhone, setNewAgentPhone] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const agentItems = agents?.map((agent) => ({
    value: agent.id,
    label: agent.name,
  }));

  const handleAddAgent = (searchValue: string) => {
    setNewAgentName(searchValue);
    setNewAgentEmail("");
    setNewAgentPhone("");
    setDialogOpen(true);
  };

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) {
      toast.error("Agent name is required");
      return;
    }

    setIsCreating(true);
    try {
      const newAgent = await createAgent({
        name: newAgentName.trim(),
        email: newAgentEmail.trim() || null,
        phone: newAgentPhone.trim() || null,
      });

      // Refresh agents list
      await mutate("agents");

      // Select the newly created agent
      onChange?.(newAgent.id);

      toast.success(`Agent "${newAgent.name}" created`);
      setDialogOpen(false);
    } catch (error) {
      console.error("Failed to create agent:", error);
      toast.error("Failed to create agent");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <Button variant="outline" disabled className="justify-between">
        Loading agents...
      </Button>
    );
  }

  return (
    <>
      <ComboboxInput
        items={agentItems}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        invalid={invalid}
        emptyStateLabel={(searchValue) => `+ Add "${searchValue}" as new agent`}
        emptyStateAction={handleAddAgent}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>
              Create a new agent. Only name is required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="agent-name">Name *</Label>
              <Input
                id="agent-name"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                placeholder="Agent name"
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent-email">Email</Label>
              <Input
                id="agent-email"
                type="email"
                value={newAgentEmail}
                onChange={(e) => setNewAgentEmail(e.target.value)}
                placeholder="agent@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent-phone">Phone</Label>
              <Input
                id="agent-phone"
                type="tel"
                value={newAgentPhone}
                onChange={(e) => setNewAgentPhone(formatPhoneInput(e.target.value))}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateAgent} disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
