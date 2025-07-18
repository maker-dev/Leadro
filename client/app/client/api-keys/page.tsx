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

const mockApiKeys = [
  {
    label: "API Key 1",
    key: "sk-mockkey-t92j8f3k2l4m5n6o7p8q9r0s1t2u3v4w5x6y7z8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z4a5b6c7d8e9f0g1h2i3j4k5l6m7n8o9p0q1r2s3t4u5v6w7x8y9z0",
    isRevoked: true,
    usage: 814,
    lastUsed: "Jun 27, 2025, 09:39 AM",
    created: "Jun 9, 2025, 06:36 PM",
    updated: "Jul 15, 2025, 03:00 PM",
  },
  {
    label: "API Key 2",
    key: "sk-mockkey-e8y0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2",
    isRevoked: false,
    usage: 256,
    lastUsed: "Never",
    created: "Jul 5, 2025, 03:04 AM",
    updated: "Jul 15, 2025, 03:00 PM",
  },
  {
    label: "API Key 3",
    key: "sk-mockkey-ooqb1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z1",
    isRevoked: false,
    usage: 390,
    lastUsed: "Jul 8, 2025, 08:19 PM",
    created: "Jul 7, 2025, 07:27 AM",
    updated: "Jul 15, 2025, 03:00 PM",
  },
];

const ApiKeysPage = () => {
  const { setLabel, setTitle } = usePageContext();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  const handleConfirmDelete = () => {
    // For now, just log the deleted key
    console.log("Deleted API key:", keyToDelete);
    handleCloseDeleteModal();
  };

  // ===================== Generate API Key Modal Handlers =====================
  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleCreateKey = (data: CreateKeyType) => {
    // For now, just log the label
    console.log("Create API Key with label:", data.label);
    handleCloseCreateModal();
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
  const handleEditKey = (data: EditKeyType) => {
    // For now, just log the new label
    console.log("Edit API Key label:", keyToEdit?.key, data.label);
    handleCloseEditModal();
  };

  return (
    <div className=" mx-auto space-y-8">
      {/* Statistics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <StatisticsCard
          title="Total API Keys"
          value={10}
          description="All keys for this client"
          icon={<FiKey />}
          ariaLabel="Total API Keys"
        />
        <StatisticsCard
          title="Active Keys"
          value={7}
          description="Currently active keys"
          icon={<FaCheckCircle />}
          ariaLabel="Active Keys"
        />
        <StatisticsCard
          title="Revoked Keys"
          value={3}
          description="Keys that have been revoked"
          icon={<FaTimesCircle />}
          ariaLabel="Revoked Keys"
        />
        <StatisticsCard
          title="Total Usage"
          value={1245}
          description="Total API calls made"
          icon={<FaChartBar />}
          ariaLabel="Total Usage"
        />
        <StatisticsCard
          title="Last Key Created"
          value="Jul 9, 2025"
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
                <th className="py-2 px-2 font-semibold">Last Used</th>
                <th className="py-2 px-2 font-semibold">Created</th>
                <th className="py-2 px-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockApiKeys.map((apiKey, idx) => (
                <tr
                  key={apiKey.key}
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
                        apiKey.isRevoked ? "bg-red-400" : "bg-black"
                      } text-white text-xs font-semibold gap-2`}
                    >
                      {apiKey.isRevoked ? "Revoked" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-2">{apiKey.usage}</td>
                  <td className="py-3 px-2">{apiKey.lastUsed}</td>
                  <td className="py-3 px-2">{apiKey.created}</td>
                  <td className="py-3 px-2 flex gap-2">
                    <button
                      className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 font-semibold"
                      tabIndex={0}
                      aria-label="Edit Label"
                      onClick={() =>
                        handleOpenEditModal({
                          key: apiKey.key,
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
                      onClick={() => handleOpenDeleteModal(apiKey.key)}
                    >
                      <FiTrash2 className="w-4 h-4" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
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
