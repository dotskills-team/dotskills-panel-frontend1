import { PaymentStatus, type IPayment, type IProject } from "@/types/project.types";

/**
 * Frontend mirror of the backend rules (project.payment.utils.ts).
 * Used only as a fallback when the server did not send the summary fields.
 * Received = COMPLETE + ADVANCED payment lines (advances and maintenance included).
 */
const RECEIVED_STATUSES: string[] = [PaymentStatus.COMPLETE, PaymentStatus.ADVANCED];

export const isReceivedPayment = (payment: Pick<IPayment, "status">) =>
  RECEIVED_STATUSES.includes(payment.status);

export const getReceivedAmount = (project: Pick<IProject, "payments" | "receivedAmount">) => {
  if (typeof project.receivedAmount === "number") return project.receivedAmount;

  return (project.payments ?? [])
    .filter(isReceivedPayment)
    .reduce((sum, p) => sum + (p.amount || 0), 0);
};

/** Positive-only: overpayment on this project never reduces it */
export const getOutstandingAmount = (
  project: Pick<IProject, "budget" | "payments" | "outstandingAmount" | "receivedAmount">,
) => {
  if (typeof project.outstandingAmount === "number") return project.outstandingAmount;

  if (project.budget === undefined || project.budget === null) return undefined;

  return Math.max(project.budget - getReceivedAmount(project), 0);
};

export const getOverpaidAmount = (
  project: Pick<IProject, "budget" | "payments" | "overpaidAmount" | "receivedAmount">,
) => {
  if (typeof project.overpaidAmount === "number") return project.overpaidAmount;

  if (project.budget === undefined || project.budget === null) return 0;

  return Math.max(getReceivedAmount(project) - project.budget, 0);
};
