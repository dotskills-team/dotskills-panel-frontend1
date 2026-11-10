"use client";

import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientMutations } from "@/features/clients/hooks/useClientMutations";
import { useCreditCandidates } from "@/features/clients/hooks/useCreditCandidates";
import { canEditCreditedTo } from "@/features/users/utils/user.utils";
import type { IClient } from "@/types/clients";

import { useUser } from "../../../context/UserContext";

interface CreditedToControlProps {
  client: IClient;
}

const nameOf = (user?: { firstName?: string; lastName?: string } | null) =>
  user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "";

/**
 * "Credited to" in the client details.
 * Everyone who can open the details sees the name (read-only).
 * Admins and the marketing & sales lead get a select to change it.
 */
export function CreditedToControl({ client }: CreditedToControlProps) {
  const { user } = useUser();
  const canEdit = canEditCreditedTo(user?.role);

  const { data: candidates = [] } = useCreditCandidates(canEdit);
  const { updateCreditedTo } = useClientMutations();

  const currentName = nameOf(client.creditedTo) || "Not set";

  if (!canEdit) {
    return <span>{currentName}</span>;
  }

  const handleChange = async (creditedTo: string) => {
    if (creditedTo === client.creditedTo?._id) return;
    try {
      await updateCreditedTo.mutateAsync({ id: client._id, payload: { creditedTo } });
      toast.success("Credited user updated");
    } catch (error) {
      toast.error("Failed to update credited user");
      console.error(error);
    }
  };

  return (
    <Select
      value={client.creditedTo?._id ?? ""}
      onValueChange={handleChange}
      disabled={updateCreditedTo.isPending}
    >
      <SelectTrigger className="h-8 w-48">
        <SelectValue placeholder={currentName} />
      </SelectTrigger>
      <SelectContent>
        {candidates.map((candidate) => (
          <SelectItem key={candidate._id} value={candidate._id}>
            {nameOf(candidate)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
