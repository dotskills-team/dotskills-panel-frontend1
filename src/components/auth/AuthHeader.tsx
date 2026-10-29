// import Link from "next/link";

// import { cn } from "@/lib/utils";
// import Image from "next/image";

// interface AuthHeaderProps {
//   className?: string;
//   /** "inverted" is used on the dark illustration panel. */
//   variant?: "default" | "inverted";
// }

// export function AuthHeader({ className, variant = "default" }: AuthHeaderProps) {
//   const isInverted = variant === "inverted";

//   return (
//     <Link
//       href="/login"
//       className={cn(
//         "inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
//         className,
//       )}
//     >
//       <Image
//         src="/assets/dotskills-logo-loading.png"
//         alt="DotSkills Panel"
//         width={300}
//         height={300}
//         priority
//         className="relative h-40 w-40 select-none object-contain sm:h-24 sm:w-24 animate-loader-breathe will-change-transform"
//       />
//     </Link>
//   );
// }


import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface AuthHeaderProps {
  className?: string;
  /** "inverted" is used on the dark illustration panel (always white logo). */
  variant?: "default" | "inverted";
}

export function AuthHeader({ className, variant = "default" }: AuthHeaderProps) {
  const isInverted = variant === "inverted";

  return (
    <Link
      href="/login"
      className={cn(
        "inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className,
      )}
    >
      <Image
        src="/assets/dotskills-logo-loading.png"
        alt="DotSkills Panel"
        width={300}
        height={300}
        priority
        className={cn(
          "relative h-40 w-40 select-none object-contain sm:h-24 sm:w-24 animate-loader-breathe will-change-transform",
          // Logo is white: keep as-is on dark surfaces, turn black on light mode
          !isInverted && "invert dark:invert-0",
        )}
      />
    </Link>
  );
}