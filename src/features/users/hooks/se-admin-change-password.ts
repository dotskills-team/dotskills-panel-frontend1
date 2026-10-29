
import api from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface AdminChangePasswordVars {
  userId: string;
  newPassword: string;
}

export function useAdminChangePassword() {
  return useMutation({
    mutationFn: async ({ userId, newPassword }: AdminChangePasswordVars) => {
      // Adjust the path to match your auth route
      const res = await api.post("/auth/admin/change-password", {
        userId,
        newPassword,
      });
      return res.data;
    },
  });
}