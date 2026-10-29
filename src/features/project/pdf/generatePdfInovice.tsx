import { pdf } from "@react-pdf/renderer";
import type { IProject } from "@/types/project.types";
import { ProjectInvoicePdf } from "./ProjectInvoicePdf";

const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]); // strip "data:application/pdf;base64," prefix
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

export const generateInvoicePdfBase64 = async (project: IProject): Promise<string> => {
    const blob = await pdf(<ProjectInvoicePdf project={project} />).toBlob();
    return blobToBase64(blob);
};