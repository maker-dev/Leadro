"use client";
import { useEffect, useState } from "react";
import { usePageContext } from "@/context/PageTitleContext";
import StatisticsCard from "@/components/ui/cards/StatisticsCard";
import BaseCard from "@/components/ui/cards/BaseCard";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
  FaClock,
  FaCalculator,
  FaFire,
  FaCrown,
} from "react-icons/fa";
import { GoKey } from "react-icons/go";
import { FiKey } from "react-icons/fi";
import { FiCopy, FiCheck, FiRotateCw, FiTrash2, FiSlash } from "react-icons/fi";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import {
  getAdminApiKeySummary,
  getAllApiKeysForClientByAdmin,
  deleteApiKeyByAdmin,
  updateApiKeyRevokedStatusByAdmin,
} from "@/services/ApiKeyService";
import type { AdminApiKey } from "@/services/ApiKeyService";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import formatDate from "@/utils/formateDate";

//

const ViewKeysPage = () => {
  const { setLabel, setTitle } = usePageContext();
  const params = useParams();
  const clientId = params.id as string;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingApiKeyId, setDeletingApiKeyId] = useState<string | null>(null);

  // API data state
  const [apiKeySummary, setApiKeySummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<AdminApiKey[]>([]);
  const [keysLoading, setKeysLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [toggleLoadingId, setToggleLoadingId] = useState<string | null>(null);

  const handleConfirmDelete = () => {
    if (!deletingApiKeyId) return;
    (async () => {
      try {
        setDeleteLoading(true);
        const res = await deleteApiKeyByAdmin(clientId, deletingApiKeyId);
        setApiKeys((prev) => prev.filter((k) => k._id !== deletingApiKeyId));
        // refresh summary silently
        try {
          const summaryRes = await getAdminApiKeySummary(clientId);
          setApiKeySummary(summaryRes.data);
        } catch (_) {
          // ignore summary refresh errors
        }
        toast.success(res?.message || "API key deleted successfully");
        setIsDeleteModalOpen(false);
        setDeletingApiKeyId(null);
      } catch (error: any) {
        const msg =
          error?.response?.data?.message || "Failed to delete API key";
        toast.error(msg);
      } finally {
        setDeleteLoading(false);
      }
    })();
  };

  useEffect(() => {
    setLabel("Api Keys");
    setTitle("Manage Api Keys");
  }, [setLabel, setTitle]);

  // Load API key summary data
  useEffect(() => {
    const loadApiKeySummary = async () => {
      try {
        setLoading(true);
        const response = await getAdminApiKeySummary(clientId);
        setApiKeySummary(response.data);
      } catch (error: any) {
        toast.error("Failed to load API key summary");
        console.error("Error loading API key summary:", error);
      } finally {
        setLoading(false);
      }
    };

    if (clientId) {
      loadApiKeySummary();
    }
  }, [clientId]);

  // Load API keys for the client (admin)
  useEffect(() => {
    const loadApiKeysForClient = async () => {
      try {
        setKeysLoading(true);
        const response = await getAllApiKeysForClientByAdmin(clientId);
        setApiKeys(response.data?.apiKeys || []);
      } catch (error: any) {
        toast.error("Failed to load API keys");
        console.error("Error loading API keys:", error);
      } finally {
        setKeysLoading(false);
      }
    };

    if (clientId) {
      loadApiKeysForClient();
    }
  }, [clientId]);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1200);
  };

  // Format last key created date
  const formatLastKeyCreated = (dateString: string | null) => {
    if (!dateString) return "No keys created";
    return formatDate(dateString);
  };

  const handleToggleRevoked = async (apiKey: AdminApiKey) => {
    try {
      setToggleLoadingId(apiKey._id);
      const newRevoked = !apiKey.revoked;
      const res = await updateApiKeyRevokedStatusByAdmin(
        clientId,
        apiKey._id,
        newRevoked
      );
      setApiKeys((prev) =>
        prev.map((k) =>
          k._id === apiKey._id ? { ...k, revoked: newRevoked } : k
        )
      );
      // refresh summary silently
      try {
        const summaryRes = await getAdminApiKeySummary(clientId);
        setApiKeySummary(summaryRes.data);
      } catch (_) {}
      const actionWord = newRevoked ? "revoked" : "activated";
      toast.success(res?.message || `API key ${actionWord} successfully`);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || "Failed to update API key status";
      toast.error(msg);
    } finally {
      setToggleLoadingId(null);
    }
  };

  return (
    <div className=" mx-auto space-y-8">
      {/* Statistics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <StatisticsCard
          title="Total API Keys"
          value={loading ? "..." : apiKeySummary?.totalApiKeys || 0}
          description="All keys for this client"
          icon={<FiKey />}
          ariaLabel="Total API Keys"
        />
        <StatisticsCard
          title="Active Keys"
          value={loading ? "..." : apiKeySummary?.activeKeys || 0}
          description="Currently active keys"
          icon={<FaCheckCircle />}
          ariaLabel="Active Keys"
        />
        <StatisticsCard
          title="Revoked Keys"
          value={loading ? "..." : apiKeySummary?.revokedKeys || 0}
          description="Keys that have been revoked"
          icon={<FaTimesCircle />}
          ariaLabel="Revoked Keys"
        />
        <StatisticsCard
          title="Total Usage"
          value={loading ? "..." : apiKeySummary?.totalUsage || 0}
          description="Total API calls made"
          icon={<FaChartBar />}
          ariaLabel="Total Usage"
        />
        <StatisticsCard
          title="Last Key Created"
          value={
            loading
              ? "..."
              : formatLastKeyCreated(apiKeySummary?.lastKeyCreated)
          }
          description="Date of the most recent key"
          icon={<FaClock />}
          ariaLabel="Last Key Created"
        />
        <StatisticsCard
          title="Average Usage"
          value={loading ? "..." : apiKeySummary?.averageUsagePerKey || 0}
          description="Average calls per key"
          icon={<FaCalculator />}
          ariaLabel="Average Usage"
        />
        <StatisticsCard
          title="Last Key Used"
          value={
            loading
              ? "..."
              : apiKeySummary?.lastKeyUsed
              ? formatDate(apiKeySummary.lastKeyUsed)
              : "Never used"
          }
          description="Most recent API call"
          icon={<FaFire />}
          ariaLabel="Last Key Used"
        />
        <StatisticsCard
          title="Top Used Key"
          value={loading ? "..." : apiKeySummary?.topUsedKey || "No usage"}
          description="Most active API key"
          icon={<FaCrown />}
          ariaLabel="Top Used Key"
        />
      </div>
      {/* Managing api keys Card */}
      <BaseCard
        logo={<GoKey className="w-6 h-6" aria-label="API Key Table" />}
        title="Client API Keys"
        description="Manage API keys for the selected client."
      >
        <div className="overflow-x-auto">
          <table
            className="min-w-full text-left"
            aria-label="Client API Keys Table"
          >
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-300">
                <th className="py-2 px-2 font-semibold min-w-[140px]">Label</th>
                <th className="py-2 px-2 font-semibold">Key</th>
                <th className="py-2 px-2 font-semibold">Status</th>
                <th className="py-2 px-2 font-semibold">Usage</th>
                <th className="py-2 px-2 font-semibold min-w-[140px]">
                  Last Used
                </th>
                <th className="py-2 px-2 font-semibold min-w-[140px]">
                  Created
                </th>
                <th className="py-2 px-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {keysLoading ? (
                <tr>
                  <td
                    className="py-4 px-2 text-center text-gray-500"
                    colSpan={7}
                  >
                    Loading...
                  </td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td
                    className="py-4 px-2 text-center text-gray-500"
                    colSpan={7}
                  >
                    No API keys found
                  </td>
                </tr>
              ) : (
                apiKeys.map((apiKey) => (
                  <tr
                    key={apiKey._id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 px-2 font-medium text-gray-900">
                      {apiKey.label}
                    </td>
                    <td className="py-3 px-2 flex items-center gap-2">
                      <span>{apiKey.key.slice(0, 14)}…</span>
                      <button
                        className="text-gray-400 hover:text-gray-700"
                        aria-label="Copy Key"
                        tabIndex={0}
                        onClick={() => handleCopy(apiKey.key)}
                      >
                        {copiedKey === apiKey.key ? (
                          <FiCheck className="inline-block text-green-600" />
                        ) : (
                          <FiCopy className="inline-block" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center px-4 py-1 rounded-full ${
                          apiKey.revoked ? "bg-red-400" : "bg-black"
                        } text-white text-xs font-semibold gap-2`}
                      >
                        {apiKey.revoked ? "Revoked" : "Active"}
                      </span>
                    </td>
                    <td className="py-3 px-2">{apiKey.usageCount}</td>
                    <td className="py-3 px-2">
                      {apiKey.lastUsedAt
                        ? formatDate(apiKey.lastUsedAt)
                        : "Never"}
                    </td>
                    <td className="py-3 px-2">
                      {formatDate(apiKey.createdAt)}
                    </td>
                    <td className="py-3 px-2 flex gap-2">
                      {apiKey.revoked ? (
                        <button
                          className={`flex items-center gap-2 border border-gray-200 rounded px-4 py-2 font-semibold bg-white hover:bg-gray-50 ${
                            toggleLoadingId === apiKey._id
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                          tabIndex={0}
                          aria-label="Activate"
                          disabled={toggleLoadingId === apiKey._id}
                          onClick={() => handleToggleRevoked(apiKey)}
                        >
                          <FiRotateCw className="w-4 h-4" />
                          {toggleLoadingId === apiKey._id
                            ? "Activating..."
                            : "Activate"}
                        </button>
                      ) : (
                        <button
                          className={`flex items-center gap-2 border border-gray-200 rounded px-4 py-2 font-semibold bg-white hover:bg-gray-50 ${
                            toggleLoadingId === apiKey._id
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                          tabIndex={0}
                          aria-label="Revoke"
                          disabled={toggleLoadingId === apiKey._id}
                          onClick={() => handleToggleRevoked(apiKey)}
                        >
                          <FiSlash className="w-4 h-4" />
                          {toggleLoadingId === apiKey._id
                            ? "Revoking..."
                            : "Revoke"}
                        </button>
                      )}
                      <button
                        className={`flex items-center gap-2 rounded px-4 py-2 font-semibold text-white ${
                          deleteLoading && deletingApiKeyId === apiKey._id
                            ? "bg-red-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        }`}
                        tabIndex={0}
                        aria-label="Delete"
                        aria-disabled={
                          deleteLoading && deletingApiKeyId === apiKey._id
                        }
                        disabled={
                          deleteLoading && deletingApiKeyId === apiKey._id
                        }
                        onClick={() => {
                          setDeletingApiKeyId(apiKey._id);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <FiTrash2 className="w-4 h-4" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </BaseCard>
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingApiKeyId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Key"
        description="Are you sure you want to delete this Api Key? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={deleteLoading}
      />
    </div>
  );
};

export default ViewKeysPage;
