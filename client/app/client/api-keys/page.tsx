"use client";
import { useEffect, useState } from "react";
import { usePageContext } from "@/context/PageTitleContext";
import StatisticsCard from "@/components/ui/cards/StatisticsCard";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaChartBar,
  FaClock,
} from "react-icons/fa";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import formSchema from "./schemas/CreateKeySchema";
import type CreateKeyType from "./types/CreateKeyType";
import EditKeySchema from "./schemas/EditKeySchema";
import EditKeyType from "./types/EditKeyType";
import FormModal from "@/components/modals/FormModal";
import { GoKey } from "react-icons/go";
import { FiKey } from "react-icons/fi";
import { FiCopy, FiCheck, FiTrash2, FiEdit, FiPlus } from "react-icons/fi";
import { toast } from "sonner";
import {
  getApiKeySummaryForClient,
  getAllApiKeysForClient,
  createApiKey,
  deleteApiKey,
  editApiKeyLabel,
} from "@/services/ApiKeyService";

const ApiKeysPage = () => {
  const { setLabel, setTitle } = usePageContext();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // ===================== API Key Summary State =====================
  const [summary, setSummary] = useState<{
    totalApiKeys: number;
    activeKeys: number;
    revokedKeys: number;
    totalUsage: number;
    lastKeyCreated: string | null;
  } | null>(null);

  // ===================== API Keys State =====================
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [loadingKeys, setLoadingKeys] = useState(true);

  // ===================== Delete Modal State =====================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  // ===================== Generate API Key Modal State =====================
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // ===================== Edit API Key Modal State =====================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [keyToEdit, setKeyToEdit] = useState<{
    key: string;
    label: string;
  } | null>(null);

  useEffect(() => {
    setLabel("Api Keys");
    setTitle("Api Keys");
    // Fetch summary
    getApiKeySummaryForClient().then((res) => {
      if (res.success) setSummary(res.data);
    });
    // Fetch API keys
    getAllApiKeysForClient().then((res) => {
      if (res.success) setApiKeys(res.data);
      setLoadingKeys(false);
    });
  }, [setLabel, setTitle]);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1200);
  };

  // ===================== Delete Modal Handlers =====================
  const handleOpenDeleteModal = (key: string) => {
    setKeyToDelete(key);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setKeyToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!keyToDelete) return;
    try {
      const res = await deleteApiKey(keyToDelete);
      if (res.success) {
        toast.success("API key deleted successfully!");
        // Refresh API keys and summary
        getAllApiKeysForClient().then((res) => {
          if (res.success) setApiKeys(res.data);
        });
        getApiKeySummaryForClient().then((res) => {
          if (res.success) setSummary(res.data);
        });
      }
      handleCloseDeleteModal();
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.message) toast.error(err.message);
        });
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to delete API key. Please try again.");
      }
      handleCloseDeleteModal();
    }
  };

  // ===================== Generate API Key Modal Handlers =====================
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleCreateKey = async (
    data: CreateKeyType,
    {
      setError,
    }: {
      setError: (
        field: string,
        error: { type: string; message: string }
      ) => void;
    }
  ) => {
    try {
      const res = await createApiKey(data.label);
      if (res.success) {
        toast.success("API key created successfully!");
        // Refresh API keys and summary
        getAllApiKeysForClient().then((res) => {
          if (res.success) setApiKeys(res.data);
        });
        getApiKeySummaryForClient().then((res) => {
          if (res.success) setSummary(res.data);
        });
        handleCloseCreateModal();
      }
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      let hasFieldError = false;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.field && err.message) {
            setError(err.field, { type: "server", message: err.message });
            hasFieldError = true;
          } else if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to create API key. Please try again.");
      }
      // Only close modal if there are no field errors
      if (!hasFieldError) handleCloseCreateModal();
      // Don't reset form on error - let user see their input and fix the error
    }
  };

  // ===================== Edit API Key Modal Handlers =====================
  const handleOpenEditModal = (apiKey: { key: string; label: string }) => {
    setKeyToEdit(apiKey);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setKeyToEdit(null);
  };
  const handleEditKey = async (
    data: EditKeyType,
    {
      setError,
    }: {
      setError: (
        field: string,
        error: { type: string; message: string }
      ) => void;
    }
  ) => {
    if (!keyToEdit) return;
    try {
      const res = await editApiKeyLabel(keyToEdit.key, data.label);
      if (res.success) {
        toast.success("API key label updated!");
        getAllApiKeysForClient().then((res) => {
          if (res.success) setApiKeys(res.data);
        });
        getApiKeySummaryForClient().then((res) => {
          if (res.success) setSummary(res.data);
        });
        handleCloseEditModal();
      }
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      let hasFieldError = false;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.field && err.message) {
            setError(err.field, { type: "server", message: err.message });
            hasFieldError = true;
          } else if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update API key label. Please try again.");
      }
      if (!hasFieldError) handleCloseEditModal();
    }
  };

  return (
    <div className=" mx-auto space-y-8">
      {/* Statistics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <StatisticsCard
          title="Total API Keys"
          value={summary ? summary.totalApiKeys : 0}
          description="All keys for this client"
          icon={<FiKey />}
          ariaLabel="Total API Keys"
        />
        <StatisticsCard
          title="Active Keys"
          value={summary ? summary.activeKeys : 0}
          description="Currently active keys"
          icon={<FaCheckCircle />}
          ariaLabel="Active Keys"
        />
        <StatisticsCard
          title="Revoked Keys"
          value={summary ? summary.revokedKeys : 0}
          description="Keys that have been revoked"
          icon={<FaTimesCircle />}
          ariaLabel="Revoked Keys"
        />
        <StatisticsCard
          title="Total Usage"
          value={summary ? summary.totalUsage : 0}
          description="Total API calls made"
          icon={<FaChartBar />}
          ariaLabel="Total Usage"
        />
        <StatisticsCard
          title="Last Key Created"
          value={
            summary && summary.lastKeyCreated
              ? new Date(summary.lastKeyCreated).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"
          }
          description="Date of the most recent key"
          icon={<FaClock />}
          ariaLabel="Last Key Created"
        />
      </div>

      {/* Managing api keys Card */}
      <div className="p-8 bg-white rounded-xl border border-gray-200 shadow">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between items-start gap-2 mb-2">
          <div className="flex items-center">
            <div className="mr-2">
              <GoKey className="w-6 h-6" aria-label="API Key Table" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold">Client API Keys</h2>
          </div>
          <button
            className="flex items-center gap-2 bg-black text-white font-medium rounded-lg px-3 py-3 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black/60 transition text-base w-full md:w-auto mt-2 md:mt-0"
            tabIndex={0}
            aria-label="Generate New API Key"
            onClick={handleOpenCreateModal}
          >
            <FiPlus className="w-5 h-5" /> Generate New API Key
          </button>
        </div>
        <p className="text-gray-500 mb-8">
          Manage your API keys for secure lead access.
        </p>
        <div className="overflow-x-auto">
          <table
            className="min-w-full text-left"
            aria-label="Client API Keys Table"
          >
            <thead>
              <tr className="text-gray-500 text-sm border-b border-gray-300">
                <th className="py-2 px-2 font-semibold">Label</th>
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
              {loadingKeys ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : apiKeys.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-400">
                    No API keys found.
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
                    <td className="py-3 px-2 min-w-[140px]">
                      {apiKey.lastUsedAt
                        ? new Date(apiKey.lastUsedAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Never"}
                    </td>
                    <td className="py-3 px-2 min-w-[140px]">
                      {new Date(apiKey.createdAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 px-2 flex gap-2">
                      <button
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 font-semibold"
                        tabIndex={0}
                        aria-label="Edit Label"
                        onClick={() =>
                          handleOpenEditModal({
                            key: apiKey._id,
                            label: apiKey.label,
                          })
                        }
                      >
                        <FiEdit className="w-4 h-4" /> Edit
                      </button>
                      <button
                        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 font-semibold"
                        tabIndex={0}
                        aria-label="Delete"
                        onClick={() => handleOpenDeleteModal(apiKey._id)}
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
      </div>

      {/* ===================== Confirm Delete Modal ===================== */}
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete API Key"
          description="Are you sure you want to delete this API key? This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
        />
      )}

      {/* ===================== FormModal for Create API Key ===================== */}
      {isCreateModalOpen && (
        <FormModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onSubmit={handleCreateKey}
          title="Generate New API Key"
          fields={[
            {
              name: "label",
              label: "Label",
              type: "text",
              placeholder: "Enter API key label",
              required: true,
            },
          ]}
          initialValues={{ label: "" }}
          validationSchema={formSchema}
          submitLabel="Generate"
          cancelLabel="Cancel"
        />
      )}

      {/* ===================== FormModal for Edit API Key ===================== */}
      {isEditModalOpen && keyToEdit && (
        <FormModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSubmit={handleEditKey}
          title="Edit API Key Label"
          fields={[
            {
              name: "label",
              label: "Label",
              type: "text",
              placeholder: "Enter new label",
              required: true,
            },
          ]}
          initialValues={{ label: keyToEdit.label }}
          validationSchema={EditKeySchema}
          submitLabel="Save"
          cancelLabel="Cancel"
        />
      )}
    </div>
  );
};

export default ApiKeysPage;
