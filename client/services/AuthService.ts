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

interface ResendVerificationPayload {
  email: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
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

export const resendVerificationEmail = async (
  data: ResendVerificationPayload
) => {
  const response = await axios.post("/users/client/resend-verification", data);
  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordPayload) => {
  const response = await axios.post("/password/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordPayload) => {
  const response = await axios.post(`/password/reset-password/${data.token}`, {
    password: data.password,
    confirmPassword: data.confirmPassword,
  });
  return response.data;
};
