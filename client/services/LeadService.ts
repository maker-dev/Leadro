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
