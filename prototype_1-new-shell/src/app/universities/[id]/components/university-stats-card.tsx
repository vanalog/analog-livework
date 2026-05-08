"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Trophy, UserCheck, UserX } from "lucide-react";
import type { Athlete } from "@/types/database";

interface UniversityStatsCardProps {
  athletes: Athlete[];
}

export function UniversityStatsCard({ athletes }: UniversityStatsCardProps) {
  const totalAthletes = athletes.length;
  const activeAthletes = athletes.filter((a) => a.status === "active").length;
  const inactiveAthletes = athletes.filter((a) => a.status === "inactive").length;
  const uniqueSports = [...new Set(athletes.map((a) => a.sport).filter(Boolean))];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Athletes</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAthletes}</div>
          <p className="text-xs text-muted-foreground">
            In roster
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Athletes</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAthletes}</div>
          <p className="text-xs text-muted-foreground">
            Currently active
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inactive Athletes</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inactiveAthletes}</div>
          <p className="text-xs text-muted-foreground">
            Currently inactive
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sports Programs</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueSports.length}</div>
          <p className="text-xs text-muted-foreground truncate" title={uniqueSports.join(", ")}>
            {uniqueSports.slice(0, 3).join(", ")}
            {uniqueSports.length > 3 && ` +${uniqueSports.length - 3}`}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
