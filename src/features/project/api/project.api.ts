// import { apiClient } from "@/lib/axios";
// import type { ApiResponse } from "@/types";
// import {
//     CreateProjectPayload,
//     IProject,
//     ProjectFilters,
//     UpdateProjectPayload
// } from "@/types/project.types";

// const BASE_URL = "/projects";

// const buildQuery = (params?: ProjectFilters) => {
//     if (!params) return "";

//     const searchParams = new URLSearchParams();

//     Object.entries(params).forEach(([key, value]) => {
//         if (
//             value !== undefined &&
//             value !== null &&
//             value !== ""
//         ) {
//             searchParams.append(key, String(value));
//         }
//     });

//     const query = searchParams.toString();

//     return query ? `?${query}` : "";
// };

// export const projectApi = {
//     /**
//      * Get all active projects
//      */
//     getProjects: (params?: ProjectFilters) =>
//         apiClient.get<ApiResponse<IProject[]>>(
//             `${BASE_URL}${buildQuery(params)}`,
//         ),

//     /**
//      * Get all deleted projects
//      */
//     getDeletedProjects: (params?: ProjectFilters) =>
//         apiClient.get<ApiResponse<IProject[]>>(
//             `${BASE_URL}/trash${buildQuery(params)}`,
//         ),

//     /**
//      * Get single project
//      */
//     getProject: (id: string) =>
//         apiClient.get<ApiResponse<IProject>>(
//             `${BASE_URL}/${id}`,
//         ),

//     /**
//      * Create project
//      */
//     createProject: (payload: CreateProjectPayload) =>
//         apiClient.post<ApiResponse<IProject>>(
//             `${BASE_URL}/create`,
//             payload,
//         ),

//     /**
//      * Update project
//      */
//     updateProject: (
//         id: string,
//         payload: UpdateProjectPayload,
//     ) =>
//         apiClient.patch<ApiResponse<IProject>>(
//             `${BASE_URL}/${id}`,
//             payload,
//         ),

//     /**
//      * Move project to trash
//      */
//     trashProject: (id: string) =>
//         apiClient.patch<ApiResponse<IProject>>(
//             `${BASE_URL}/${id}/trash`,
//         ),

//     /**
//      * Restore project
//      */
//     restoreProject: (id: string) =>
//         apiClient.patch<ApiResponse<IProject>>(
//             `${BASE_URL}/${id}/restore`,
//         ),

//     sendInvoice: (id: string, pdfBase64: string) =>
//         apiClient.post<ApiResponse<{ sent: boolean }>>(
//             `${BASE_URL}/${id}/send-invoice`,
//             { pdfBase64 },
//         ),
//             /**
//      * permanent project delete
//      */
// permanentDeleteProject: (id: string) =>
//     apiClient.delete<ApiResponse<null>>(
//         `${BASE_URL}/${id}/delete`,
//     ),
// };

// export default projectApi;



import { apiClient } from "@/lib/axios";
import type { ApiResponse } from "@/types";
import {
    CreateProjectPayload,
    IDeveloperProject,
    IDeveloperProjectsResponse,
    IProject,
    MyProjectFilters,
    ProjectFilters,
    UpdateProjectPayload,
} from "@/types/project.types";

const BASE_URL = "/projects";

const buildQuery = (params?: ProjectFilters) => {
    if (!params) return "";

    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            searchParams.append(key, String(value));
        }
    });

    const query = searchParams.toString();

    return query ? `?${query}` : "";
};

export const projectApi = {
    /**
     * Get all active projects
     */
    getProjects: (params?: ProjectFilters) =>
        apiClient.get<ApiResponse<IProject[]>>(
            `${BASE_URL}${buildQuery(params)}`,
        ),

    /**
     * Get projects assigned to the logged-in developer,
     * sorted by priority (1 = highest)
     */
    getMyProjects: (params?: MyProjectFilters) =>
        apiClient.get<IDeveloperProjectsResponse>(
            `${BASE_URL}/my-projects${buildQuery(params as ProjectFilters)}`,
        ),

    /**
     * Get all deleted projects
     */
    getDeletedProjects: (params?: ProjectFilters) =>
        apiClient.get<ApiResponse<IProject[]>>(
            `${BASE_URL}/trash${buildQuery(params)}`,
        ),

    /**
     * Get single project
     */
    getProject: (id: string) =>
        apiClient.get<ApiResponse<IProject>>(`${BASE_URL}/${id}`),

    /**
     * Create project
     */
    createProject: (payload: CreateProjectPayload) =>
        apiClient.post<ApiResponse<IProject>>(
            `${BASE_URL}/create`,
            payload,
        ),

    /**
     * Update project
     */
    updateProject: (id: string, payload: UpdateProjectPayload) =>
        apiClient.patch<ApiResponse<IProject>>(
            `${BASE_URL}/${id}`,
            payload,
        ),

    /**
     * Move project to trash
     */
    trashProject: (id: string) =>
        apiClient.patch<ApiResponse<IProject>>(
            `${BASE_URL}/${id}/trash`,
        ),

    /**
     * Restore project
     */
    restoreProject: (id: string) =>
        apiClient.patch<ApiResponse<IProject>>(
            `${BASE_URL}/${id}/restore`,
        ),

    /**
     * Send invoice PDF to the client
     */
    sendInvoice: (id: string, pdfBase64: string) =>
        apiClient.post<ApiResponse<{ sent: boolean }>>(
            `${BASE_URL}/${id}/send-invoice`,
            { pdfBase64 },
        ),

    /**
     * Permanently delete a project
     */
    permanentDeleteProject: (id: string) =>
        apiClient.delete<ApiResponse<null>>(
            `${BASE_URL}/${id}/delete`,
        ),
};

export default projectApi;