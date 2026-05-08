"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import type { Athlete } from "@/types/database";

interface UniversityAthletesSidebarProps {
  athletes: Athlete[];
}

export function UniversityAthletesSidebar({ athletes }: UniversityAthletesSidebarProps) {
  const router = useRouter();

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
            No athletes at this university
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto">
            {athletes.map((athlete) => (
              <div
                key={athlete.id}
                className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => router.push(`/athletes/${athlete.id}`)}
              >
                <Avatar className="h-8 w-8">
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
