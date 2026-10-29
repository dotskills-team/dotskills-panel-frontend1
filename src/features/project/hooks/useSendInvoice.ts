"use client";

import { useMutation } from "@tanstack/react-query";
import projectApi from "@/features/project/api/project.api"; // adjust path if your project.api.ts lives elsewhere

interface SendInvoiceArgs {
    id: string;
    pdfBase64: string;
}

export const useSendInvoice = () => {
    return useMutation({
        mutationFn: ({ id, pdfBase64 }: SendInvoiceArgs) =>
            projectApi.sendInvoice(id, pdfBase64),
    });
};