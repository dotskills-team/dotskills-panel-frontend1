import { cn } from "@/lib/utils";
import { getRoleStyle } from "@/features/users/utils/user-badges";

export function RoleBadge({
  role,
  className,
}: {
  role: string;
  className?: string;
}) {
  const style = getRoleStyle(role);
  const Icon = style.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style.className,
        className,
      )}
    >
      <Icon className="h-3 w-3" />
      {style.label}
    </span>
  );
}
