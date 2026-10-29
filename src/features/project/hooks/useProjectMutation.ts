// "use client";

// import {
//   useMutation,
//   useQueryClient,
// } from "@tanstack/react-query";

// import { projectApi } from "../api/project.api";
// import { projectKeys } from "../api/project.keys";

// export const useProjectMutations = () => {
//   const queryClient = useQueryClient();

//   const invalidateProjects = async () => {
//     await Promise.all([
//       queryClient.invalidateQueries({
//         queryKey: projectKeys.lists(),
//       }),

//       queryClient.invalidateQueries({
//         queryKey: projectKeys.deleted(),
//       }),
//     ]);
//   };

//   const createProject = useMutation({
//     mutationFn: projectApi.createProject,

//     onSuccess: () => {
//       invalidateProjects();
//     },
//   });

//   const updateProject = useMutation({
//     mutationFn: ({
//       id,
//       payload,
//     }: {
//       id: string;
//       payload: Parameters<
//         typeof projectApi.updateProject
//       >[1];
//     }) =>
//       projectApi.updateProject(
//         id,
//         payload,
//       ),

//     onSuccess: (_, variables) => {
//       invalidateProjects();

//       queryClient.invalidateQueries({
//         queryKey: projectKeys.detail(
//           variables.id,
//         ),
//       });
//     },
//   });

//   const trashProject = useMutation({
//     mutationFn: projectApi.trashProject,

//     onSuccess: (_, id) => {
//       invalidateProjects();

//       queryClient.invalidateQueries({
//         queryKey: projectKeys.detail(id),
//       });
//     },
//   });

//   const restoreProject = useMutation({
//     mutationFn: projectApi.restoreProject,

//     onSuccess: (_, id) => {
//       invalidateProjects();

//       queryClient.invalidateQueries({
//         queryKey: projectKeys.detail(id),
//       });
//     },
//   });

//   return {
//     createProject,
//     updateProject,
//     trashProject,
//     restoreProject,
//   };
// };


"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { projectApi } from "../api/project.api";
import { projectKeys } from "../api/project.keys";
import { financialAccountKeys } from "@/features/financial-account/hooks/use-financial-account";

export const useProjectMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProjects = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: projectKeys.lists(),
      }),

      queryClient.invalidateQueries({
        queryKey: projectKeys.deleted(),
      }),

      // payment বদলালে account balance ও payments page বদলায়
      queryClient.invalidateQueries({
        queryKey: financialAccountKeys.all,
      }),
    ]);
  };

  const createProject = useMutation({
    mutationFn: projectApi.createProject,

    onSuccess: () => {
      invalidateProjects();
    },
  });

  const updateProject = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<
        typeof projectApi.updateProject
      >[1];
    }) =>
      projectApi.updateProject(
        id,
        payload,
      ),

    onSuccess: (_, variables) => {
      invalidateProjects();

      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(
          variables.id,
        ),
      });
    },
  });

  const trashProject = useMutation({
    mutationFn: projectApi.trashProject,

    onSuccess: (_, id) => {
      invalidateProjects();

      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(id),
      });
    },
  });

  const restoreProject = useMutation({
    mutationFn: projectApi.restoreProject,

    onSuccess: (_, id) => {
      invalidateProjects();

      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(id),
      });
    },
  });

  const permanentDeleteProject = useMutation({
    mutationFn: projectApi.permanentDeleteProject,

    onSuccess: (_, id) => {
      invalidateProjects();

      queryClient.removeQueries({
        queryKey: projectKeys.detail(id),
      });
    },
  });

  return {
    createProject,
    updateProject,
    trashProject,
    restoreProject,
    permanentDeleteProject,
  };
};