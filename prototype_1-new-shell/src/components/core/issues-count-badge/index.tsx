import { memo } from "react";
import { Badge } from "@/components/ui/badge";

interface IssuesCountBadgeProps {
  count: number;
}

const IssuesCountBadge = memo(function IssuesBadge({
  count,
}: IssuesCountBadgeProps) {
  if (count === 0) {
    return (
      <div className="flex flex-1 gap-2 items-center">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <Badge className="rounded-full font-semibold text-green-700 bg-green-100">
          No Issues
        </Badge>
      </div>
    );
  }

  const issueText = count === 1 ? "1 Issue" : `${count} Issues`;

  return (
    <div className="flex flex-1 gap-2 items-center">
      <div className="w-2 h-2 rounded-full bg-destructive" />
      <Badge variant="destructive" className="rounded-full font-semibold">
        {issueText} found
      </Badge>
    </div>
  );
});

export { IssuesCountBadge };
