"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, ChevronRight, Users } from "lucide-react";
import Link from "next/link";
import type { Athlete } from "@/types/database";

interface UniversityAthletesSectionProps {
  athletes: Athlete[];
  universityId: string;
}

export function UniversityAthletesSection({ athletes }: UniversityAthletesSectionProps) {
  const [search, setSearch] = useState("");
  const [sportFilter, setSportFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Get unique sports for filter
  const sports = useMemo(() => {
    const uniqueSports = [...new Set(athletes.map((a) => a.sport).filter(Boolean))];
    return uniqueSports.sort();
  }, [athletes]);

  const filteredAthletes = useMemo(() => {
    let filtered = athletes;

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.first_name.toLowerCase().includes(searchLower) ||
          a.last_name.toLowerCase().includes(searchLower) ||
          a.sport?.toLowerCase().includes(searchLower)
      );
    }

    // Sport filter
    if (sportFilter !== "all") {
      filtered = filtered.filter((a) => a.sport === sportFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => a.status === statusFilter);
    }

    // Sort by last name
    return [...filtered].sort((a, b) => a.last_name.localeCompare(b.last_name));
  }, [athletes, search, sportFilter, statusFilter]);

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-muted-foreground" />
          <span className="font-semibold text-lg">Athletes</span>
          <Badge variant="outline">{athletes.length} athlete{athletes.length !== 1 ? "s" : ""}</Badge>
        </div>
        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search athletes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sportFilter} onValueChange={setSportFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Sports" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                {sports.map((sport) => (
                  <SelectItem key={sport} value={sport!}>
                    {sport}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[250px] text-muted-foreground font-normal">Athlete</TableHead>
              <TableHead className="text-muted-foreground font-normal">Sport</TableHead>
              <TableHead className="text-muted-foreground font-normal">Position</TableHead>
              <TableHead className="text-muted-foreground font-normal">Class Year</TableHead>
              <TableHead className="text-muted-foreground font-normal">Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
            <TableBody>
              {filteredAthletes.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No athletes found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAthletes.map((athlete) => {
                  const initials = `${athlete.first_name[0]}${athlete.last_name[0]}`;
                  return (
                    <TableRow key={athlete.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <Link
                              href={`/athletes/${athlete.id}`}
                              className="font-medium hover:underline"
                            >
                              {athlete.first_name} {athlete.last_name}
                            </Link>
                            {athlete.jersey_number && (
                              <span className="text-sm text-muted-foreground">
                                #{athlete.jersey_number}
                              </span>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{athlete.sport}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {athlete.position || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          {athlete.class_year || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            athlete.status === "active"
                              ? "default"
                              : athlete.status === "graduated"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {athlete.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Link href={`/athletes/${athlete.id}`}>
                          <Button variant="ghost" size="icon">
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

      </CardContent>
    </Card>
  );
}
