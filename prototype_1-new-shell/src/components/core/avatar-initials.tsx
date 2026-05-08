import { getInitials } from "@/lib/formatters";

interface AvatarInitialsProps {
  firstName?: string;
  lastName?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-12 h-12 text-lg",
  md: "w-16 h-16 text-xl",
  lg: "w-24 h-24 text-2xl",
};

export function AvatarInitials({
  firstName,
  lastName,
  size = "lg",
}: AvatarInitialsProps) {
  const initials =
    firstName && lastName ? getInitials(firstName, lastName) : "?";

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold`}
    >
      {initials}
    </div>
  );
}
