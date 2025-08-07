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
