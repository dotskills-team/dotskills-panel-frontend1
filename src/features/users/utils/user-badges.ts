import {
  Crown,
  Shield,
  Briefcase,
  Code,
  Palette,
  TrendingUp,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface RoleStyle {
  label: string;
  className: string;
  hex: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
}

export const roleStyles: Record<string, RoleStyle> = {
  SUPER_ADMIN: {
    label: "Super Admin",
    className:
      "border-[#E53E3E] bg-[#FFE5E5] text-[#E53E3E] dark:bg-[#5A1A1A] dark:text-[#FC8181]",
    hex: "#E53E3E",
    icon: Crown,
    bgColor: "bg-[#E53E3E]",
    textColor: "text-white",
  },
  ADMIN: {
    label: "Admin",
    className:
      "border-[#8B5CF6] bg-[#F3E8FF] text-[#8B5CF6] dark:bg-[#3E1E5E] dark:text-[#D8B4FE]",
    hex: "#8B5CF6",
    icon: Shield,
    bgColor: "bg-[#8B5CF6]",
    textColor: "text-white",
  },
  MANAGER: {
    label: "Manager",
    className:
      "border-[#3B82F6] bg-[#EFF6FF] text-[#3B82F6] dark:bg-[#1E3A8A] dark:text-[#93C5FD]",
    hex: "#3B82F6",
    icon: Briefcase,
    bgColor: "bg-[#3B82F6]",
    textColor: "text-white",
  },
  DEVELOPER: {
    label: "Developer",
    className:
      "border-[#10B981] bg-[#ECFDF5] text-[#10B981] dark:bg-[#064E3B] dark:text-[#6EE7B7]",
    hex: "#10B981",
    icon: Code,
    bgColor: "bg-[#10B981]",
    textColor: "text-white",
  },
  DESIGNER: {
    label: "Designer",
    className:
      "border-[#EC4899] bg-[#FDF2F8] text-[#EC4899] dark:bg-[#501F3D] dark:text-[#F472B6]",
    hex: "#EC4899",
    icon: Palette,
    bgColor: "bg-[#EC4899]",
    textColor: "text-white",
  },
  MARKETER: {
    label: "Marketer",
    className:
      "border-[#F59E0B] bg-[#FFFBEB] text-[#F59E0B] dark:bg-[#452407] dark:text-[#FCD34D]",
    hex: "#F59E0B",
    icon: TrendingUp,
    bgColor: "bg-[#F59E0B]",
    textColor: "text-white",
  },
  STAFF: {
    label: "Staff",
    className:
      "border-[#6B7280] bg-[#F3F4F6] text-[#6B7280] dark:bg-[#2D3748] dark:text-[#D1D5DB]",
    hex: "#6B7280",
    icon: Users,
    bgColor: "bg-[#6B7280]",
    textColor: "text-white",
  },
  STUDENT: {
    label: "Student",
    className:
      "border-[#06B6D4] bg-[#ECFDFD] text-[#06B6D4] dark:bg-[#082F4B] dark:text-[#67E8F9]",
    hex: "#06B6D4",
    icon: Users,
    bgColor: "bg-[#06B6D4]",
    textColor: "text-white",
  },
  INSTRUCTOR: {
    label: "Instructor",
    className:
      "border-[#A855F7] bg-[#FAF5FF] text-[#A855F7] dark:bg-[#3F2464] dark:text-[#E9D5FF]",
    hex: "#A855F7",
    icon: Briefcase,
    bgColor: "bg-[#A855F7]",
    textColor: "text-white",
  },
};

export const statusStyles: Record<string, { label: string; className: string; hex: string }> = {
  ACTIVE: {
    label: "Active",
    className: "border-[#10B981] bg-[#ECFDF5] text-[#10B981] dark:bg-[#064E3B] dark:text-[#6EE7B7]",
    hex: "#10B981",
  },
  INACTIVE: {
    label: "Inactive",
    className: "border-[#F59E0B] bg-[#FFFBEB] text-[#F59E0B] dark:bg-[#452407] dark:text-[#FCD34D]",
    hex: "#F59E0B",
  },
  SUSPENDED: {
    label: "Suspended",
    className: "border-[#E53E3E] bg-[#FFE5E5] text-[#E53E3E] dark:bg-[#5A1A1A] dark:text-[#FC8181]",
    hex: "#E53E3E",
  },
};

export function getRoleStyle(role: string): RoleStyle {
  return roleStyles[role] || roleStyles.STAFF;
}

export function getStatusStyle(status: string) {
  return statusStyles[status] || statusStyles.INACTIVE;
}

export const roleOptions = Object.entries(roleStyles).map(([key, value]) => ({
  value: key,
  label: value.label,
}));

export const statusOptions = Object.entries(statusStyles).map(([key, value]) => ({
  value: key,
  label: value.label,
}));
