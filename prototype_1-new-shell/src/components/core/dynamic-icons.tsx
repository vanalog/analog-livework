import {
  Briefcase,
  Check,
  ChevronRight,
  Files,
  Funnel,
  GripVertical,
  Pencil,
  Plus,
  ScrollText,
  Star,
  Trash2,
  Users,
  X,
  Volleyball,
} from "lucide-react";

const iconMap = {
  briefcase: Briefcase,
  check: Check,
  chevronRight: ChevronRight,
  group: Files,
  gripVertical: GripVertical,
  funnel: Funnel,
  pencil: Pencil,
  plus: Plus,
  users: Users,
  trash2: Trash2,
  contract: ScrollText,
  star: Star,
  x: X,
  volleyball: Volleyball,
} as const;

export type IconName = keyof typeof iconMap;

interface DynamicIconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
}

function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const Icon = iconMap[name];

  if (!Icon) {
    return null;
  }

  return <Icon className={props.className} {...props} />;
}

export { DynamicIcon };
