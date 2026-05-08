"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Building2 } from "lucide-react";
import type { AgreementWithRelations } from "@/types/database";

interface SponsorsSectionProps {
  agreements: AgreementWithRelations[];
}

export function SponsorsSection({ agreements }: SponsorsSectionProps) {
  const router = useRouter();

  // Extract unique sponsors from agreements
  const sponsors = useMemo(() => {
    const sponsorMap = new Map<string, AgreementWithRelations["sponsor"]>();
    agreements.forEach((agreement) => {
      if (agreement.sponsor && !sponsorMap.has(agreement.sponsor.id)) {
        sponsorMap.set(agreement.sponsor.id, agreement.sponsor);
      }
    });
    return Array.from(sponsorMap.values()).filter(Boolean);
  }, [agreements]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Building2 className="h-4 w-4" />
          Sponsors
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {sponsors.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {sponsors.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No sponsors yet
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {sponsors.map((sponsor) => sponsor && (
              <div
                key={sponsor.id}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => router.push(`/sponsors/${sponsor.id}`)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-muted">
                    {getInitials(sponsor.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">
                    {sponsor.name}
                  </span>
                  {sponsor.industry && (
                    <span className="text-xs text-muted-foreground truncate">
                      {sponsor.industry}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
