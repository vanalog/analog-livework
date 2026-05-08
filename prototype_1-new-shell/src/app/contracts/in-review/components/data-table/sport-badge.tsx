import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { SPORT_LABELS } from "@/lib/constants";
import { Sport } from "@/types/api-types";

interface SportBadgeProps {
  sport: Sport;
}

const SportBadge = memo(function SportBadge({ sport }: SportBadgeProps) {
  const sportName = SPORT_LABELS[sport];
  return sportName && <Badge variant={"outline"}>{sportName}</Badge>;
});

export { SportBadge };
