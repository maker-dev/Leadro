import axios from "@/lib/axiosInstance";

interface BaseLeadFields {
  name?: string;
  email: string;
  phone?: string;
  source?: string;
  status?: string;
  message?: string;
}

// Extra fields allowed, but must not conflict with known fields
export type CreateLeadPayload = BaseLeadFields & {
  [K in Exclude<string, keyof BaseLeadFields>]?: string;
};

// Query parameters for getting leads
export interface GetLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
  owner?: string;
}

// Lead type with owner information
export interface Lead {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  source?: string;
  status: string;
  message?: string;
  extraFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  owner: "me" | "shared";
  sharedBy?: string;
  permissions?: string[];
}

// API response type
export interface GetLeadsResponse {
  success: boolean;
  data: {
    leads: Lead[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

interface getLeadPayload {
  id: string;
}

interface updateLeadPayload {
  id: string;
  data: Partial<CreateLeadPayload>;
}

interface deleteLeadPayload {
  id: string;
}

export const createLead = async (data: CreateLeadPayload) => {
  const response = await axios.post("/leads/client", data);
  return response.data;
};

export const getLeads = async (
  params: GetLeadsParams = {}
): Promise<GetLeadsResponse> => {
  const response = await axios.get("/leads/client", { params });
  return response.data;
};

export const getLead = async (data: getLeadPayload) => {
  const response = await axios.get(`/leads/client/${data.id}`);
  return response.data;
};

export const updateLead = async (data: updateLeadPayload) => {
  const response = await axios.put(`/leads/client/${data.id}`, data.data);
  return response.data;
};

export const deleteLead = async (data: deleteLeadPayload) => {
  const response = await axios.delete(`/leads/client/${data.id}`);
  return response.data;
};

/* ADMIN API */

// Admin lead type with client information
export interface AdminLead {
  _id: string;
  name?: string;
  email: string;
  phone?: string;
  source?: string;
  status: string;
  message?: string;
  extraFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  ownerId: string;
  clientName: string;
}

// Admin API response type
export interface GetAllClientsLeadsResponse {
  success: boolean;
  data: {
    leads: AdminLead[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

// Query parameters for admin leads
export interface GetAdminLeadsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
}

export const getAllClientsLeads = async (
  params: GetAdminLeadsParams = {}
): Promise<GetAllClientsLeadsResponse> => {
  const response = await axios.get("/leads/admin/clients", { params });
  return response.data;
};

export const deleteAdminLead = async (data: deleteLeadPayload) => {
  const response = await axios.delete(`/leads/admin/clients/${data.id}`);
  return response.data;
};

export const getAdminLeadById = async (data: getLeadPayload) => {
  const response = await axios.get(`/leads/admin/clients/${data.id}`);
  return response.data;
};

export const updateAdminLead = async (data: updateLeadPayload) => {
  const response = await axios.put(
    `/leads/admin/clients/${data.id}`,
    data.data
  );
  return response.data;
};

// Admin create lead payload with client email
export interface CreateLeadForClientPayload extends CreateLeadPayload {
  clientEmail: string;
}

export const createLeadForClient = async (data: CreateLeadForClientPayload) => {
  const response = await axios.post("/leads/admin/clients", data);
  return response.data;
};

// Export filtered client leads as Excel (returns Blob and suggested filename)
export const exportClientLeads = async (
  params: GetLeadsParams = {}
): Promise<{ blob: Blob; filename: string }> => {
  const response = await axios.get("/leads/client/export", {
    params,
    responseType: "blob",
  });
  const disposition = (response.headers as any)["content-disposition"] as
    | string
    | undefined;
  let filename = "leads_client.xlsx";
  if (disposition) {
    const match = /filename(?:\*=UTF-8'')?=([^;]+)/i.exec(disposition);
    if (match && match[1]) {
      filename = decodeURIComponent(match[1].replace(/"/g, "").trim());
    }
  }
  return { blob: response.data as Blob, filename };
};

// Export filtered admin leads as Excel (returns Blob and suggested filename)
export const exportAdminLeads = async (
  params: GetAdminLeadsParams = {}
): Promise<{ blob: Blob; filename: string }> => {
  const response = await axios.get("/leads/admin/clients/export", {
    params,
    responseType: "blob",
  });
  const disposition = (response.headers as any)["content-disposition"] as
    | string
    | undefined;
  let filename = "leads_admin.xlsx";
  if (disposition) {
    const match = /filename(?:\*=UTF-8'')?=([^;]+)/i.exec(disposition);
    if (match && match[1]) {
      filename = decodeURIComponent(match[1].replace(/"/g, "").trim());
    }
  }
  return { blob: response.data as Blob, filename };
};
