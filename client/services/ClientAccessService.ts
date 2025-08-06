import axios from "@/lib/axiosInstance";

export interface InviteClientPayload {
  email: string;
  permissions?: string[];
}

interface UpdateClientAccessPayload {
  id: string;
  permissions: string[];
}

interface RespondInvitationPayload {
  id: string;
  action: "accept" | "reject";
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

export const updateClientAccess = async (data: UpdateClientAccessPayload) => {
  const response = await axios.put(
    `/client-access/update-permission/${data.id}`,
    { permissions: data.permissions }
  );
  return response.data;
};

export const deleteClientAccess = async (id: string) => {
  const response = await axios.delete(`/client-access/remove-sharing/${id}`);
  return response.data;
};

export const respondToInvitation = async (data: RespondInvitationPayload) => {
  const response = await axios.put(
    `/client-access/respond-invitation/${data.id}`,
    { action: data.action }
  );
  return response.data;
};
