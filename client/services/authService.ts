import axios from "@/lib/axiosInstance";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await axios.post("/users/client/register", data);
  return response.data;
};
