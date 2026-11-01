import { MyExpensesPageClient } from "@/components/dashboard/my-finance/MyExpensesPageClient";

export const metadata = {
  title: "My Expenses | DotSkills Panel",
  description: "Record and review the expenses you paid from your accounts.",
};

export default function MyExpensesPage() {
  return <MyExpensesPageClient />;
}
