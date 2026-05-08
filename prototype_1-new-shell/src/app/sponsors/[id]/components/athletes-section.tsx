"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import type { AgreementWithRelations } from "@/types/database";

interface AthletesSectionProps {
  agreements: AgreementWithRelations[];
}

export function AthletesSection({ agreements }: AthletesSectionProps) {
  const router = useRouter();

  // Extract unique athletes from agreements
  const athletes = useMemo(() => {
    const athleteMap = new Map<string, AgreementWithRelations["athlete"]>();
    agreements.forEach((agreement) => {
      if (agreement.athlete && !athleteMap.has(agreement.athlete.id)) {
        athleteMap.set(agreement.athlete.id, agreement.athlete);
      }
    });
    return Array.from(athleteMap.values());
  }, [agreements]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Users className="h-4 w-4" />
          Athletes
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {athletes.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {athletes.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No athletes yet
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {athletes.map((athlete) => (
              <div
                key={athlete.id}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => router.push(`/athletes/${athlete.id}`)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={athlete.avatar_url || undefined} />
                  <AvatarFallback className="text-xs">
                    {getInitials(athlete.first_name, athlete.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">
                    {athlete.first_name} {athlete.last_name}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize truncate">
                    {athlete.sport?.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
