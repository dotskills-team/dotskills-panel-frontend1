import { cn } from "@/lib/utils";
import { getStatusStyle } from "@/features/users/utils/user-badges";

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const style = getStatusStyle(status);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        style.className,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          status === "ACTIVE" && "animate-[dot-pulse_2s_ease-in-out_infinite]",
        )}
        style={{ backgroundColor: style.hex }}
        aria-hidden="true"
      />
      {style.label}
    </span>
  );
}
