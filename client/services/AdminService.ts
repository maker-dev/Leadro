import axios from "@/lib/axiosInstance";

export interface GetClientsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetAllClientsResponse {
  success: boolean;
  data: {
    clients: Client[];
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

// Example client type (adjust fields according to your model)
export interface Client {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  // add other fields as needed
}

export interface UpdateClientProfileParams {
  name: string;
  email: string;
  // add other optional fields if your backend supports them
}

export interface AdminDashboardData {
  totalClients: number;
  totalLeads: number;
  apiUsageToday: number;
  totalApiKeys: number;
  activeApiKeys: number;
  revokedApiKeys: number;
}

export interface AdminDashboardResponse {
  success: boolean;
  data: AdminDashboardData;
}

export interface AdminLeadActivityData {
  day: string;
  leads: number;
  new: number;
  contacted: number;
  converted: number;
  lost: number;
}

export interface AdminLeadActivityResponse {
  success: boolean;
  data: AdminLeadActivityData[];
}

export const getAllClients = async () => {
  const response = await axios.get("/users/admin/clients");
  return response.data;
};

export const getAllClientsWithPagination = async (
  params: GetClientsParams = {}
): Promise<GetAllClientsResponse> => {
  const response = await axios.get("/users/admin/clients/pagination", {
    params,
  });
  return response.data;
};

export const getClientById = async (userId: string) => {
  const response = await axios.get(`/users/admin/clients/${userId}`);
  return response.data;
};

export const getClientViewData = async (userId: string) => {
  const response = await axios.get(`/users/admin/clients/${userId}/view`);
  return response.data;
};

export const updateClientProfile = async (
  userId: string,
  data: UpdateClientProfileParams
) => {
  const response = await axios.put(`/users/admin/clients/${userId}`, data);
  return response.data;
};

export const deleteClient = async (userId: string) => {
  const response = await axios.delete(`/users/admin/clients/${userId}`);
  return response.data;
};

export const getAdminDashboardData = async (): Promise<AdminDashboardResponse> => {
  const response = await axios.get<AdminDashboardResponse>("/users/admin/dashboard");
  return response.data;
};

export const getAdminLeadActivity = async (): Promise<AdminLeadActivityResponse> => {
  const response = await axios.get<AdminLeadActivityResponse>("/users/admin/lead-activity");
  return response.data;
};
