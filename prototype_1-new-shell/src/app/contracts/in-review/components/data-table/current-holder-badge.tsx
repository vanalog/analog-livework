import { memo } from "react";
import { CurrentHolder } from "@/types/api-types";
import { CURRENT_HOLDER_LABELS } from "@/lib/constants";

interface CurrentHolderBadgeProps {
  currentHolder: CurrentHolder;
}

const CurrentHolderBadge = memo(function CurrentHolderBadge({
  currentHolder,
}: CurrentHolderBadgeProps) {
  const config = CURRENT_HOLDER_LABELS[currentHolder];
  if (!config) return null;

  return <span className="font-medium">{config}</span>;
});

export { CurrentHolderBadge };
