"use client";

import { Mail, Phone, Globe, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface University {
  id: string;
  name: string;
  conference: string | null;
  website: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
}

interface UniversitySummaryCardProps {
  university: University;
  totalCommitted: number;
  agreementCount: number;
  athleteCount: number;
  onEdit: () => void;
  onDelete: () => void;
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function UniversitySummaryCard({
  university,
  totalCommitted,
  agreementCount,
  athleteCount,
  onEdit,
  onDelete,
}: UniversitySummaryCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        {/* Top section: Name/Location/Conference on left, Total Committed on right */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{university.name}</h1>
            {university.conference && (
              <div className="flex items-center gap-3">
                <Badge variant="outline">{university.conference}</Badge>
              </div>
            )}
          </div>

          {/* Total Committed */}
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Committed</p>
            <p className="text-3xl font-bold tabular-nums">
              {formatCurrency(totalCommitted)}
            </p>
          </div>
        </div>

        <div className="border-t pt-4" />

        {/* Contact info row */}
        <div className="flex items-center gap-8 flex-wrap">
          {/* Contact */}
          {(university.contact_name || university.contact_email) && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              {university.contact_name && (
                <span className="font-medium">{university.contact_name}</span>
              )}
              {university.contact_email && (
                <span className="text-muted-foreground">{university.contact_email}</span>
              )}
            </div>
          )}

          {/* Phone */}
          {university.contact_phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{university.contact_phone}</span>
            </div>
          )}

          {/* Website */}
          {university.website && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <a
                href={university.website.startsWith("http") ? university.website : `https://${university.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {university.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
        </div>

        <div className="border-t pt-4 mt-4" />

        {/* Stats and actions row */}
        <div className="flex items-center gap-8">
          <div>
            <p className="text-sm text-muted-foreground">Athletes</p>
            <p className="text-lg font-semibold">{athleteCount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Agreements</p>
            <p className="text-lg font-semibold">{agreementCount}</p>
          </div>

          {/* Edit and Delete buttons */}
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
