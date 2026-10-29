import PaymentsPageClient from "@/components/dashboard/payment/PaymentPageClient";

export const metadata = {
  title: "Payments | DotSkills Panel",
  description: "View all project payments and filter them by financial account.",
};

export default function PaymentsPage() {
  return <PaymentsPageClient />;
}