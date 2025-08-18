import axiosInstance from "../lib/axiosInstance";

export interface ClientDashboardData {
  totalLeads: number;
  leadsSharedWithMe: number;
  leadsEnteredToday: number;
  lastApiKeyCreated: string | null;
  lastLeadCreated: string | null;
}

export interface ClientDashboardResponse {
  success: boolean;
  data: ClientDashboardData;
}

export interface LeadActivityData {
  day: string;
  leads: number;
  new: number;
  contacted: number;
  converted: number;
  lost: number;
}

export interface LeadActivityResponse {
  success: boolean;
  data: LeadActivityData[];
}

export const getDashboardData = async (): Promise<ClientDashboardResponse> => {
  const response = await axiosInstance.get<ClientDashboardResponse>(
    "/users/client/dashboard"
  );
  return response.data;
};

export const getLeadActivity = async (): Promise<LeadActivityResponse> => {
  const response = await axiosInstance.get<LeadActivityResponse>(
    "/users/client/lead-activity"
  );
  return response.data;
};
