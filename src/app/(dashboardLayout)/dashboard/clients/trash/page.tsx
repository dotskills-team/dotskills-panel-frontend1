import type { Metadata } from "next";

import { ClientsTrashPageClient } from "@/components/dashboard/client/trash/clients-trash-page-client";

export const metadata: Metadata = {
  title: "Clients Trash",
};

export default function ClientsTrashPage() {
  return <ClientsTrashPageClient />;
}
