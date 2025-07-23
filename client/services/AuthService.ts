import axios from "@/lib/axiosInstance";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterPayload) => {
  const response = await axios.post("/users/client/register", data);
  return response.data;
};

export const loginUser = async (data: LoginPayload) => {
  const response = await axios.post("/users/login", data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post("/users/logout");
  return response.data;
};
