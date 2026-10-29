"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clientApi } from "../api/client.api";
import { clientKeys } from "../api/client.keys";

export function useClientMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({
        queryKey: clientKeys.all,
      }),
    ]);

  return {
    createClient: useMutation({
      mutationFn: clientApi.createClient,
      onSuccess: invalidate,
    }),

    updateClient: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Parameters<
          typeof clientApi.updateClient
        >[1];
      }) =>
        clientApi.updateClient(id, payload),

      onSuccess: invalidate,
    }),

    trashClient: useMutation({
      mutationFn: clientApi.trashClient,
      onSuccess: invalidate,
    }),

    restoreClient: useMutation({
      mutationFn: clientApi.restoreClient,
      onSuccess: invalidate,
    }),

    permanentlyDeleteClient: useMutation({
      mutationFn:
        clientApi.permanentlyDeleteClient,
      onSuccess: invalidate,
    }),

    updateStatus: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Parameters<
          typeof clientApi.updateStatus
        >[1];
      }) =>
        clientApi.updateStatus(id, payload),

      onSuccess: invalidate,
    }),

    assignManager: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Parameters<
          typeof clientApi.assignManager
        >[1];
      }) =>
        clientApi.assignManager(id, payload),

      onSuccess: invalidate,
    }),

    addNote: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Parameters<
          typeof clientApi.addNote
        >[1];
      }) =>
        clientApi.addNote(id, payload),

      onSuccess: invalidate,
    }),

    addDocument: useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Parameters<
          typeof clientApi.addDocument
        >[1];
      }) =>
        clientApi.addDocument(id, payload),

      onSuccess: invalidate,
    }),
  };
}