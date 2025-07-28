import axios from "@/lib/axiosInstance";

interface UpdateNamePayload {
  name: string;
}

export const getProfile = async () => {
  const response = await axios.get("/users/profile");
  return response.data;
};

export const updateName = async (data: UpdateNamePayload) => {
  const response = await axios.patch("/users/change-name", data);
  return response.data;
};
