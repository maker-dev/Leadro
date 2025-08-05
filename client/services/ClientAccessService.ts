import axios from "@/lib/axiosInstance";

export interface InviteClientPayload {
  email: string;
  permissions?: string[];
}

export const inviteClient = async (data: InviteClientPayload) => {
  const response = await axios.post("/client-access/invite", data);
  return response.data;
};

export const getSharedWithMe = async () => {
  const response = await axios.get("/client-access/shared-with-me");
  return response.data;
};

export const getSharedByMe = async () => {
  const response = await axios.get("/client-access/shared-by-me");
  return response.data;
};
