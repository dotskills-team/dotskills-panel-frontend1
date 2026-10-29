import { UsersPageClient } from "@/components/dashboard/users/UsersPageClient";

export const metadata = {
  title: "Users Management | DotSkills Panel",
  description: "Manage team members and their permissions",
};

export default function UsersPage() {
  return (
      <UsersPageClient />
  );
}
