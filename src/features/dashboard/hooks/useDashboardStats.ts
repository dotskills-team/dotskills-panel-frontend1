"use client";

import { useUsers } from "@/features/users/hooks/useUsers";
import { useLeads } from "@/features/leads/hooks/useLeads";
import { LeadStatus } from "@/types/lead";

export const useDashboardStats = () => {
  // Fetch user stats
  const usersTotal = useUsers({ limit: 1, page: 1 });
  const usersActive = useUsers({ limit: 1, page: 1, status: "ACTIVE" });
  const usersInactive = useUsers({ limit: 1, page: 1, status: "INACTIVE" });
  
  // Fetch lead stats
  const leadsTotal = useLeads({ limit: 1, page: 1 });
  const leadsNew = useLeads({ limit: 1, page: 1, status: LeadStatus.NEW });
  
  const isLoading = usersTotal.isLoading || leadsTotal.isLoading;
  
  return {
    isLoading,
    users: {
      total: usersTotal.data?.meta?.total ?? 0,
      active: usersActive.data?.meta?.total ?? 0,
      inactive: usersInactive.data?.meta?.total ?? 0,
      suspended: 0,
    },
    leads: {
      total: leadsTotal.data?.meta?.total ?? 0,
      new: leadsNew.data?.meta?.total ?? 0,
    },
  };
};
