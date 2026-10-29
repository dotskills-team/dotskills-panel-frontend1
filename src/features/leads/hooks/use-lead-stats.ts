// "use client";

// import { LeadStatus } from "@/types/lead";
// import { useLeads } from "./useLeads";

// /**
//  * Derives dashboard statistics purely from the existing `getLeads` endpoint's
//  * pagination metadata (`meta.total`). No backend changes required: each
//  * query just asks for `limit=1` so the network payload stays tiny while
//  * `meta.total` gives us the accurate count for that filter.
//  */
// export const useLeadStats = () => {
//   const total = useLeads({ limit: 1, page: 1 });
//   const newLeads = useLeads({ limit: 1, page: 1, status: LeadStatus.NEW });
//   const converted = useLeads({ limit: 1, page: 1, isConverted: true });
//   const lost = useLeads({ limit: 1, page: 1, status: LeadStatus.LOST });

//   const isLoading =
//     total.isLoading ||
//     newLeads.isLoading ||
//     converted.isLoading ||
//     lost.isLoading;

//   const totalCount = total.data?.meta?.total ?? 0;
//   const newCount = newLeads.data?.meta?.total ?? 0;
//   const convertedCount = converted?.data?.meta?.total ?? 0;
//   const lostCount = lost.data?.meta?.total ?? 0;

//   const conversionRate =
//     totalCount > 0 ? (convertedCount / totalCount) * 100 : 0;

//   return {
//     isLoading,
//     totalCount,
//     newCount,
//     convertedCount,
//     lostCount,
//     conversionRate,
//   };
// };




"use client";

import { LeadContactStatus, LeadStatus } from "@/types/lead";
import { useLeads } from "./useLeads";

/**
 * Derives dashboard statistics purely from the existing `getLeads` endpoint's
 * pagination metadata (`meta.total`). No backend changes required: each
 * query just asks for `limit=1` so the network payload stays tiny while
 * `meta.total` gives us the accurate count for that filter.
 *
 * NOTE: hooks are called individually (not in a .map/.forEach loop) to
 * respect the Rules of Hooks — the number and order of hook calls must
 * stay identical across renders.
 */
export const useLeadStats = () => {
  // Overall
  const total = useLeads({ limit: 1, page: 1 });
  const converted = useLeads({ limit: 1, page: 1, isConverted: true });

  // LeadStatus
  const newStatus = useLeads({ limit: 1, page: 1, status: LeadStatus.NEW });
  const contactedStatus = useLeads({ limit: 1, page: 1, status: LeadStatus.CONTACTED });
  const qualifiedStatus = useLeads({ limit: 1, page: 1, status: LeadStatus.QUALIFIED });
  const proposalSentStatus = useLeads({ limit: 1, page: 1, status: LeadStatus.PROPOSAL_SENT });
  const confirmedMeetingStatus = useLeads({ limit: 1, page: 1, status: LeadStatus.CONFIRMED_MEETING });
  const negotiationStatus = useLeads({ limit: 1, page: 1, status: LeadStatus.NEGOTIATION });
  const onHoldStatus = useLeads({ limit: 1, page: 1, status: LeadStatus.ON_HOLD });
  const wonStatus = useLeads({ limit: 1, page: 1, status: LeadStatus.WON });
  const lostStatus = useLeads({ limit: 1, page: 1, status: LeadStatus.LOST });

  // LeadContactStatus
  const noResponseContact = useLeads({ limit: 1, page: 1, contactStatus: LeadContactStatus.NO_RESPONSE });
  const busyContact = useLeads({ limit: 1, page: 1, contactStatus: LeadContactStatus.BUSY });
  const nextContactContact = useLeads({ limit: 1, page: 1, contactStatus: LeadContactStatus.NEXT_CONTACT });
  const phoneOffContact = useLeads({ limit: 1, page: 1, contactStatus: LeadContactStatus.PHONE_OFF });

  const isLoading =
    total.isLoading ||
    converted.isLoading ||
    newStatus.isLoading ||
    contactedStatus.isLoading ||
    qualifiedStatus.isLoading ||
    proposalSentStatus.isLoading ||
    confirmedMeetingStatus.isLoading ||
    negotiationStatus.isLoading ||
    onHoldStatus.isLoading ||
    wonStatus.isLoading ||
    lostStatus.isLoading ||
    noResponseContact.isLoading ||
    busyContact.isLoading ||
    nextContactContact.isLoading ||
    phoneOffContact.isLoading;

  const totalCount = total.data?.meta?.total ?? 0;
  const convertedCount = converted.data?.meta?.total ?? 0;

  const statusCounts: Record<LeadStatus, number> = {
    [LeadStatus.NEW]: newStatus.data?.meta?.total ?? 0,
    [LeadStatus.CONTACTED]: contactedStatus.data?.meta?.total ?? 0,
    [LeadStatus.QUALIFIED]: qualifiedStatus.data?.meta?.total ?? 0,
    [LeadStatus.PROPOSAL_SENT]: proposalSentStatus.data?.meta?.total ?? 0,
    [LeadStatus.CONFIRMED_MEETING]: confirmedMeetingStatus.data?.meta?.total ?? 0,
    [LeadStatus.NEGOTIATION]: negotiationStatus.data?.meta?.total ?? 0,
    [LeadStatus.ON_HOLD]: onHoldStatus.data?.meta?.total ?? 0,
    [LeadStatus.WON]: wonStatus.data?.meta?.total ?? 0,
    [LeadStatus.LOST]: lostStatus.data?.meta?.total ?? 0,
  };

  const contactStatusCounts: Record<LeadContactStatus, number> = {
    [LeadContactStatus.NO_RESPONSE]: noResponseContact.data?.meta?.total ?? 0,
    [LeadContactStatus.BUSY]: busyContact.data?.meta?.total ?? 0,
    [LeadContactStatus.NEXT_CONTACT]: nextContactContact.data?.meta?.total ?? 0,
    [LeadContactStatus.PHONE_OFF]: phoneOffContact.data?.meta?.total ?? 0,
  };

  // Backward-compatible flat fields used by existing UI (LeadsStats card grid)
  const newCount = statusCounts[LeadStatus.NEW];
  const lostCount = statusCounts[LeadStatus.LOST];

  const conversionRate =
    totalCount > 0 ? (convertedCount / totalCount) * 100 : 0;

  return {
    isLoading,
    totalCount,
    convertedCount,
    conversionRate,

    // flat (kept for existing components)
    newCount,
    lostCount,

    // full breakdowns
    statusCounts,
    contactStatusCounts,
  };
};