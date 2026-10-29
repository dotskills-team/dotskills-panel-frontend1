"use client";

import { useMemo } from "react";
import type { User } from "@/types/user.types";
import { UserStatus, Role } from "@/types/user.types";

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  verified: number;
  unverified: number;
  roleDistribution: Record<string, number>;
  departmentDistribution: Record<string, number>;
}

export const useUserStats = (users?: User[]): UserStats => {
  return useMemo(() => {
    if (!users || users.length === 0) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        suspended: 0,
        verified: 0,
        unverified: 0,
        roleDistribution: {},
        departmentDistribution: {},
      };
    }

    const stats: UserStats = {
      total: users.length,
      active: 0,
      inactive: 0,
      suspended: 0,
      verified: 0,
      unverified: 0,
      roleDistribution: {},
      departmentDistribution: {},
    };

    users.forEach((user) => {
      if (user.status === UserStatus.ACTIVE) stats.active++;
      if (user.status === UserStatus.INACTIVE) stats.inactive++;
      if (user.status === UserStatus.SUSPENDED) stats.suspended++;
      if (user.isVerified) stats.verified++;
      else stats.unverified++;

      stats.roleDistribution[user.role] =
        (stats.roleDistribution[user.role] || 0) + 1;

      if (user.department) {
        stats.departmentDistribution[user.department] =
          (stats.departmentDistribution[user.department] || 0) + 1;
      }
    });

    return stats;
  }, [users]);
};
