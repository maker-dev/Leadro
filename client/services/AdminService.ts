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
