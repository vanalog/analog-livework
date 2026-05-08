"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Mail, Phone, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { Sponsor } from "@/types/database";

interface SponsorHeaderProps {
  sponsor: Sponsor;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SponsorHeader({ sponsor, onEdit, onDelete }: SponsorHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Link href="/sponsors">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Sponsors
          </Button>
        </Link>
      </div>

      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{sponsor.name}</h1>
          </div>
          <p className="text-muted-foreground">{sponsor.industry}</p>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {(sponsor.contact_name || sponsor.contact_email) && (
              <div className="flex items-center gap-1.5">
                <Mail className="h-4 w-4" />
                {sponsor.contact_name && <span>{sponsor.contact_name}</span>}
                {sponsor.contact_email && <span className="text-foreground">{sponsor.contact_email}</span>}
              </div>
            )}
            {sponsor.contact_phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-4 w-4" />
                <span>{sponsor.contact_phone}</span>
              </div>
            )}
            {sponsor.website && (
              <a
                href={sponsor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-foreground"
              >
                <Globe className="h-4 w-4" />
                <span>{sponsor.website.replace(/^https?:\/\//, "")}</span>
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Sponsor
          </Button>
          <Button variant="outline" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
