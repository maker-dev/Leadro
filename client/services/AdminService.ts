import axios from "@/lib/axiosInstance";

export const getAllClients = async () => {
  const response = await axios.get("/users/admin/clients");
  return response.data;
};
