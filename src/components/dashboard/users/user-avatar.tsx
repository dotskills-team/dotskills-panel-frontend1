import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getRoleStyle } from "@/features/users/utils/user-badges";
import { getInitials } from "@/lib/format";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  role: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function UserAvatar({
  firstName,
  lastName,
  fullName,
  avatar,
  role,
  size = "md",
  className,
}: UserAvatarProps) {
  const style = getRoleStyle(role);

  return (
    <Avatar
      className={cn(sizeMap[size], "ring-2 ring-offset-2 ring-offset-[var(--card)]", className)}
      style={{ ["--tw-ring-color" as string]: `${style.hex}55` }}
    >
      <AvatarImage src={avatar} alt={fullName} />
      <AvatarFallback
        className="font-semibold"
        style={{ backgroundColor: `${style.hex}1A`, color: style.hex }}
      >
        {getInitials(firstName, lastName)}
      </AvatarFallback>
    </Avatar>
  );
}
