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

export const createLead = async (data: CreateLeadPayload) => {
  const response = await axios.post("/leads/client", data);
  return response.data;
};
