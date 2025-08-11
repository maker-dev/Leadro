import axios from "@/lib/axiosInstance";

export type ApiKey = {
  _id: string;
  clientId: string;
  label: string;
  revoked: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiKeySummary = {
  totalApiKeys: number;
  activeKeys: number;
  revokedKeys: number;
  totalUsage: number;
  lastKeyCreated: string | null;
};

export type ClientApiKeyStats = {
  clientId: string;
  clientName: string;
  email: string;
  totalApiKeys: number;
  activeKeys: number;
  revokedKeys: number;
  totalUsageCount: number;
};

export type ClientApiKeyStatsPagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type GetAllClientsApiKeyStatsResponse = {
  success: boolean;
  data: ClientApiKeyStats[];
  pagination: ClientApiKeyStatsPagination;
};

export type GetAllClientsApiKeyStatsParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "revoked";
  totalusagecount_min?: number;
  totalusagecount_max?: number;
  totalkeysnumber_min?: number;
  totalkeysnumber_max?: number;
};

// New types for admin API key management
export type AdminApiKeySummary = {
  totalApiKeys: number;
  activeKeys: number;
  revokedKeys: number;
  totalUsage: number;
  lastKeyCreated: string | null;
  lastKeyUsed: string | null;
  averageUsagePerKey: number;
  topUsedKey: string | null;
};

export type AdminApiKey = {
  _id: string;
  clientId: string;
  label: string;
  key: string;
  revoked: boolean;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetAllApiKeysForClientByAdminResponse = {
  success: boolean;
  message: string;
  data: {
    clientId: string;
    totalKeys: number;
    apiKeys: AdminApiKey[];
  };
};

export type DeleteApiKeyByAdminResponse = {
  success: boolean;
  message: string;
  data: {
    deletedApiKey: {
      _id: string;
      clientId: string;
      label: string;
      revoked: boolean;
      usageCount: number;
      lastUsedAt: string | null;
      createdAt: string;
    };
  };
};

export type UpdateApiKeyRevokedStatusByAdminResponse = {
  success: boolean;
  message: string;
  data: {
    updatedApiKey: AdminApiKey;
  };
};

// Create a new API key
export async function createApiKey(label: string) {
  const res = await axios.post("/apikey/generate-key", { label });
  return res.data;
}

// Edit API key label
export async function editApiKeyLabel(apiKeyId: string, label: string) {
  const res = await axios.patch(`/apikey/${apiKeyId}/label`, { label });
  return res.data;
}

// Delete API key
export async function deleteApiKey(apiKeyId: string) {
  const res = await axios.delete(`/apikey/${apiKeyId}`);
  return res.data;
}

// Get all API keys for current client
export async function getAllApiKeysForClient() {
  const res = await axios.get("/apikey/client");
  return res.data;
}

// Get API key summary for current client
export async function getApiKeySummaryForClient() {
  const res = await axios.get("/apikey/client/summary");
  return res.data;
}

// Get all clients' API key stats (admin only)
export async function getAllClientsApiKeyStats(
  params: GetAllClientsApiKeyStatsParams = {}
) {
  const res = await axios.get<GetAllClientsApiKeyStatsResponse>(
    "/apikey/admin/clients",
    { params }
  );
  return res.data;
}

// Get API key summary for admin (admin only)
export async function getAdminApiKeySummary(clientId: string) {
  const res = await axios.get(`/apikey/admin/summary/${clientId}`);
  return res.data;
}

// Get all API keys for a specific client (admin only)
export async function getAllApiKeysForClientByAdmin(clientId: string) {
  const res = await axios.get<GetAllApiKeysForClientByAdminResponse>(
    `/apikey/admin/keys/${clientId}`
  );
  return res.data;
}

// Delete a specific API key for a client (admin only)
export async function deleteApiKeyByAdmin(clientId: string, apiKeyId: string) {
  const res = await axios.delete<DeleteApiKeyByAdminResponse>(
    `/apikey/admin/${clientId}/keys/${apiKeyId}`
  );
  return res.data;
}

// Update API key revoked status for a client (admin only)
export async function updateApiKeyRevokedStatusByAdmin(
  clientId: string,
  apiKeyId: string,
  revoked: boolean
) {
  const res = await axios.patch<UpdateApiKeyRevokedStatusByAdminResponse>(
    `/apikey/admin/${clientId}/keys/${apiKeyId}/revoked-status`,
    { revoked }
  );
  return res.data;
}
