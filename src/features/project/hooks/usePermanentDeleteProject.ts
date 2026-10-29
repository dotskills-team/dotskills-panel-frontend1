import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import projectApi from "../api/project.api";

export const usePermanentDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectApi.permanentDeleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", "trash"] });
      toast.success("Project permanently deleted.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete project.");
    },
  });
};