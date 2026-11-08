import * as React from "react";

/**
 * Bangladeshi Taka (৳) icon. Lucide has no taka glyph, so this mirrors the
 * lucide icon API (size/className/stroke props) to be a drop-in replacement
 * for DollarSign / CircleDollarSign.
 */
export const TakaIcon = React.forwardRef<
  SVGSVGElement,
  React.SVGProps<SVGSVGElement> & { size?: number | string }
>(({ size = 24, className, ...props }, ref) => (
  <svg
    ref={ref}
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...props}
  >
    <path d="M5 9h14" />
    <path d="M9 4v11a4 4 0 0 0 4 4h2" />
    <path d="M9 9h5a3 3 0 0 1 0 6H9" />
  </svg>
));
TakaIcon.displayName = "TakaIcon";
