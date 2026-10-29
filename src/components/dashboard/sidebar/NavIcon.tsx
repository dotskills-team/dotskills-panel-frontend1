import {
  ArrowLeftRight,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  CreditCard,
  FolderKanban,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  SquarePen,
  Tags,
  Target,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Banknote,
  BookOpen,
  Briefcase,
  Building2,
  ClipboardList,
  CreditCard,
  FolderKanban,
  KeyRound,
  Landmark,
  LayoutDashboard,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  ShoppingCart,
  PenSquare: SquarePen,
  Tags,
  Target,
  Users,
  Wallet,
};

interface NavIconProps {
  name?: string;
  colorClass?: string;
  className?: string;
}

export function NavIcon({ name, colorClass, className }: NavIconProps) {
  if (!name) return null;
  const Icon = ICONS[name];
  if (!Icon) return null;

  return (
    <Icon
      aria-hidden="true"
      className={cn("h-4 w-4 shrink-0", colorClass, className)}
    />
  );
}