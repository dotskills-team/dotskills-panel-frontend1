"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { leadApi } from "../api/lead.api";
import { leadKeys } from "../api/lead.keys";
import { UpdateLeadContactStatusPayload } from "@/types/lead";

export const useLeadMutations = () => {
  const queryClient = useQueryClient();

  const invalidateLeads = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: leadKeys.lists() }),
      queryClient.invalidateQueries({ queryKey: leadKeys.deleted() }),
    ]);
  };

  const importLeads = useMutation({
  mutationFn: leadApi.importLeads,

  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: leadKeys.all,
    });
  },
});

  const createLead = useMutation({
    mutationFn: leadApi.createLead,
    onSuccess: () => {
      invalidateLeads();
    },
  });

  const updateLead = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof leadApi.updateLead>[1];
    }) => leadApi.updateLead(id, payload),
    onSuccess: (_, variables) => {
      invalidateLeads();
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.id),
      });
    },
  });

  const updateLeadStatus = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof leadApi.updateStatus>[1];
    }) => leadApi.updateStatus(id, payload),
    onSuccess: (_, variables) => {
      invalidateLeads();
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.id),
      });
    },
  });

  const updateContactStatus = useMutation({
  mutationFn: ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateLeadContactStatusPayload;
  }) => leadApi.updateContactStatus(id, payload),

  onSuccess: (_, variables) => {
    queryClient.invalidateQueries({
      queryKey: leadKeys.lists(),
    });

    queryClient.invalidateQueries({
      queryKey: leadKeys.detail(variables.id),
    });
  },
});

  const assignLead = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof leadApi.assignLead>[1];
    }) => leadApi.assignLead(id, payload),
    onSuccess: (_, variables) => {
      invalidateLeads();
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.id),
      });
    },
  });

  const convertLead = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload?: Parameters<typeof leadApi.convertLead>[1];
    }) => leadApi.convertLead(id, payload),
    onSuccess: (_, variables) => {
      invalidateLeads();
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.id),
      });
    },
  });

  const addNote = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof leadApi.addNote>[1];
    }) => leadApi.addNote(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.id),
      });
    },
  });

  const addAttachment = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof leadApi.addAttachment>[1];
    }) => leadApi.addAttachment(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: leadKeys.detail(variables.id),
      });
    },
  });

  const trashLead = useMutation({
    mutationFn: leadApi.trashLead,
    onSuccess: () => {
      invalidateLeads();
    },
  });

  const restoreLead = useMutation({
    mutationFn: leadApi.restoreLead,
    onSuccess: () => {
      invalidateLeads();
    },
  });

  const permanentlyDeleteLead = useMutation({
    mutationFn: leadApi.permanentlyDeleteLead,
    onSuccess: () => {
      invalidateLeads();
    },
  });

  return {
    createLead,
    updateLead,
    updateLeadStatus,
    updateContactStatus,
    importLeads,
    assignLead,
    convertLead,
    addNote,
    addAttachment,
    trashLead,
    restoreLead,
    permanentlyDeleteLead,
  };
};
