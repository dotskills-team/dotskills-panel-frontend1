import { MyFinancialAccountsPageClient } from "@/components/dashboard/my-finance/MyFinancialAccountsPageClient";

export const metadata = {
  title: "Financial Accounts | DotSkills Panel",
  description: "Financial accounts assigned to you.",
};

export default function MyAccountsPage() {
  return <MyFinancialAccountsPageClient />;
}
