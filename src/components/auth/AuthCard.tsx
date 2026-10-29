import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border/70 bg-card/60 p-6 backdrop-blur-sm sm:p-8",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_-16px_rgba(0,0,0,0.12)]",
        "dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_20px_40px_-20px_rgba(0,0,0,0.55)]",
        className,
      )}
    >
      <div className="mb-6 space-y-1.5">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h1>
        {description && (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {children}

      {footer && <div className="mt-6">{footer}</div>}
    </div>
  );
}
