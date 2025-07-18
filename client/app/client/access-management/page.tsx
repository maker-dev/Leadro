"use client";
import { useEffect, useState } from "react";
import { usePageContext } from "@/context/PageTitleContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import NormalTextInput from "@/components/ui/inputs/NormalTextInput";
import {
  FiUserPlus,
  FiEye,
  FiEdit2,
  FiTrash2,
  FiMail,
  FiEdit3,
  FiShare2,
  FiClock,
  FiDatabase,
  FiCheckCircle,
} from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import formSchema from "./schemas/InviteClientSchema";
import EditPermissionsFormSchema from "./schemas/EditPermissionsSchema";
import EditPermissionsFormValues from "./types/EditPermissionsType";
import FormValues from "./types/InviteClientType";
import BaseCard from "@/components/ui/cards/BaseCard";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

// ===================== Permissions List & Types =====================
const permissionsList = [
  { value: "read", label: "Read", icon: FiEye },
  { value: "update", label: "Update", icon: FiEdit2 },
  { value: "delete", label: "Delete", icon: FiTrash2 },
] as const;
type Perm = (typeof permissionsList)[number]["value"];

// ===================== Mock Data =====================
const sharedClients = [
  {
    email: "alice@company.com",
    permissions: ["read", "update"],
    status: "Active",
    invitedDate: "2024-01-15",
  },
  {
    email: "bob@startup.io",
    permissions: ["read"],
    status: "Pending",
    invitedDate: "2024-01-10",
  },
  {
    email: "carol@enterprise.com",
    permissions: ["read", "update", "delete"],
    status: "Active",
    invitedDate: "2024-01-05",
  },
];

const sharedWithMeClients = [
  {
    name: "David Wilson",
    email: "david@techcorp.com",
    permissions: ["read", "update"],
    status: "Active",
    date: "2024-01-12",
    type: "accepted",
  },
  {
    name: "Emma Davis",
    email: "emma@solutions.com",
    permissions: ["read"],
    status: "Active",
    date: "2024-01-08",
    type: "accepted",
  },
  {
    name: "Michael Chen",
    email: "michael@innovate.com",
    permissions: ["read", "update", "delete"],
    status: "Pending",
    date: "2024-01-18",
    type: "pending",
  },
  {
    name: "Sarah Johnson",
    email: "sarah@growth.co",
    permissions: ["read"],
    status: "Pending",
    date: "2024-01-20",
    type: "pending",
  },
];

function AccessManagementPage() {
  // ===================== Page Title Context =====================
  const { setLabel, setTitle } = usePageContext();
  useEffect(() => {
    setLabel("Access Management");
    setTitle("Access Management");
  }, [setLabel, setTitle]);

  // ===================== Invite Client Form (react-hook-form) =====================
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", permissions: [] },
    mode: "onBlur",
  });

  // ===================== Invite Client Form Logic =====================
  const watchedPermissions = watch("permissions");
  const isReadRequired =
    watchedPermissions.includes("update") ||
    watchedPermissions.includes("delete");

  const handlePermissionChange = (perm: Perm) => {
    const current = new Set<Perm>(watchedPermissions);
    if (current.has(perm)) {
      // Unchecking
      current.delete(perm);
      if (perm === "read") {
        current.delete("update");
        current.delete("delete");
      }
      setValue("permissions", Array.from(current));
      trigger("permissions");
    } else {
      // Checking
      current.add(perm);
      if (perm === "update" || perm === "delete") {
        current.add("read");
      }
      setValue("permissions", Array.from(current));
      trigger("permissions");
    }
  };

  const onSubmit = (data: FormValues) => {
    // For now, just log the data
    console.log("Invite submitted:", data);
  };

  // ===================== Edit Permissions Modal State =====================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<
    null | (typeof sharedClients)[number]
  >(null);

  // ===================== Edit Permissions Modal Form (react-hook-form) =====================
  const {
    register: editRegister,
    handleSubmit: handleEditFormSubmit,
    formState: { errors: editErrors },
    setValue: setEditValue,
    watch: editWatch,
    reset: editReset,
  } = useForm<EditPermissionsFormValues>({
    resolver: zodResolver(EditPermissionsFormSchema),
    defaultValues: { permissions: [] },
    mode: "onBlur",
  });

  // ===================== Edit Permissions Modal Handlers =====================
  const handleOpenEditModal = (client: (typeof sharedClients)[number]) => {
    setSelectedClient(client);
    editReset({ permissions: client.permissions as Perm[] });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedClient(null);
    editReset({ permissions: [] });
  };

  const editWatchedPermissions = editWatch("permissions");

  const handleEditPermissionChange = (perm: Perm) => {
    const current = new Set<Perm>(editWatchedPermissions);
    if (current.has(perm)) {
      current.delete(perm);
      if (perm === "read") {
        current.delete("update");
        current.delete("delete");
      }
    } else {
      current.add(perm);
      if (perm === "update" || perm === "delete") {
        current.add("read");
      }
    }
    setEditValue("permissions", Array.from(current));
  };

  const onEditSubmit = (data: EditPermissionsFormValues) => {
    // For now, just log the new permissions
    console.log(
      "Updated permissions for",
      selectedClient?.email,
      data.permissions
    );
    handleCloseEditModal();
  };

  // ===================== Delete Modal State =====================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<
    null | (typeof sharedClients)[number]
  >(null);

  // ===================== Delete Modal Handlers =====================
  const handleOpenDeleteModal = (client: (typeof sharedClients)[number]) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null);
  };

  const handleConfirmDelete = () => {
    // For now, just log the deleted client
    console.log("Deleted client:", clientToDelete?.email);
    handleCloseDeleteModal();
  };

  // ===================== Render =====================
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ===================== Invite Client Card ===================== */}
      <BaseCard
        logo={<FiUserPlus className="w-6 h-6" aria-label="Invite a Client" />}
        title={"Invite a Client"}
        description={
          "Send an invitation to share your leads with another client"
        }
      >
        <form
          autoComplete="off"
          aria-label="Invite Client Form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 md:mb-2 items-start">
            <div>
              <NormalTextInput
                label="Client Email"
                id="email"
                type="email"
                placeholder="Enter client email address"
                required
                {...register("email")}
                error={errors.email}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Permissions
              </label>
              <div className="flex flex-col gap-3 mt-1">
                {/* Register permissions as a hidden input for validation */}
                <input type="hidden" {...register("permissions")} />
                {permissionsList.map((perm) => {
                  const Icon = perm.icon;
                  const checked = watchedPermissions.includes(perm.value);
                  return (
                    <label
                      key={perm.value}
                      className="inline-flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="accent-black w-4 h-4"
                        checked={checked}
                        onChange={() => handlePermissionChange(perm.value)}
                        disabled={
                          perm.value === "read" && isReadRequired && checked
                        }
                      />
                      <Icon className="w-4 h-4" />
                      <span className="text-base">{perm.label}</span>
                    </label>
                  );
                })}
                {errors.permissions && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.permissions.message as string}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md font-semibold shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 cursor-pointer"
              aria-label="Send Invitation"
            >
              <FiMail className="w-5 h-5" aria-hidden="true" />
              Send Invitation
            </button>
          </div>
        </form>
      </BaseCard>

      {/* ===================== Clients I've Shared With Card ===================== */}
      <BaseCard
        logo={
          <FiShare2 className="w-6 h-6" aria-label="Clients I've Shared With" />
        }
        title={"Client I've Shared With"}
        description={"Manage access permissions for clients you've invited."}
      >
        <div className="overflow-x-auto">
          {sharedClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[120px] text-center">
              <span className="text-4xl mb-3" aria-hidden="true">
                🤝
              </span>
              <div className="text-lg font-semibold mb-1">
                No clients shared with yet
              </div>
              <div className="text-gray-500 mb-4">
                You haven't shared access with any clients.
              </div>
            </div>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-300">
                  <th className="py-2 px-2 font-semibold">Client Email</th>
                  <th className="py-2 px-2 font-semibold">Permissions</th>
                  <th className="py-2 px-2 font-semibold">Status</th>
                  <th className="py-2 px-2 font-semibold">Invited Date</th>
                  <th className="py-2 px-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sharedClients.map((client) => (
                  <tr
                    key={client.email}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 px-2 font-medium text-gray-900">
                      {client.email}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        {client.permissions.includes("read") && (
                          <FiEye
                            className="w-5 h-5 text-green-600"
                            title="Read"
                          />
                        )}
                        {client.permissions.includes("update") && (
                          <FiEdit2
                            className="w-5 h-5 text-blue-600"
                            title="Update"
                          />
                        )}
                        {client.permissions.includes("delete") && (
                          <FiTrash2
                            className="w-5 h-5 text-red-500"
                            title="Delete"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {client.status === "Active" ? (
                        <span className="inline-flex items-center px-4 py-1 rounded-full bg-black text-white text-sm font-semibold gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold gap-2">
                          <FiClock className="w-4 h-4 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2">{client.invitedDate}</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          className="p-2 rounded border border-gray-200 hover:bg-gray-100"
                          aria-label="Edit"
                          onClick={() => handleOpenEditModal(client)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              handleOpenEditModal(client);
                          }}
                        >
                          <FiEdit3 className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 rounded border border-gray-200 hover:bg-gray-100 text-red-500"
                          aria-label="Delete"
                          onClick={() => handleOpenDeleteModal(client)}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ")
                              handleOpenDeleteModal(client);
                          }}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </BaseCard>

      {/* ===================== Clients Who Shared With Me Card ===================== */}
      <BaseCard
        logo={
          <LuUsers
            className="w-6 h-6"
            aria-label="Clients Who Shared With Me"
          />
        }
        title="Clients Who Shared With Me"
        description="View leads shared by other clients and manage invitation requests."
      >
        <div className="overflow-x-auto">
          {sharedWithMeClients.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[120px] text-center">
              <span className="text-4xl mb-3" aria-hidden="true">
                👥
              </span>
              <div className="text-lg font-semibold mb-1">
                No clients have shared with you
              </div>
              <div className="text-gray-500 mb-4">
                No one has shared access with you yet.
              </div>
            </div>
          ) : (
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-300">
                  <th className="py-2 px-2 font-semibold">Client Name</th>
                  <th className="py-2 px-2 font-semibold">Email</th>
                  <th className="py-2 px-2 font-semibold">Permissions</th>
                  <th className="py-2 px-2 font-semibold">Status</th>
                  <th className="py-2 px-2 font-semibold">Date</th>
                  <th className="py-2 px-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sharedWithMeClients.map((client) => (
                  <tr
                    key={client.email}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 px-2 font-medium text-gray-900">
                      {client.name}
                    </td>
                    <td className="py-3 px-2">{client.email}</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        {client.permissions.includes("read") && (
                          <FiEye
                            className="w-5 h-5 text-green-600"
                            title="Read"
                          />
                        )}
                        {client.permissions.includes("update") && (
                          <FiEdit2
                            className="w-5 h-5 text-blue-600"
                            title="Update"
                          />
                        )}
                        {client.permissions.includes("delete") && (
                          <FiTrash2
                            className="w-5 h-5 text-red-500"
                            title="Delete"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {client.status === "Active" ? (
                        <span className="inline-flex items-center px-4 py-1 rounded-full bg-black text-white text-sm font-semibold gap-2">
                          <span className="w-2 h-2 rounded-full bg-green-400 mr-2" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold gap-2">
                          <FiClock className="w-4 h-4 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2">{client.date}</td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        {client.type === "accepted" ? (
                          <button
                            className="flex items-center gap-2 px-4 py-2 rounded bg-white border border-gray-200 text-gray-900 font-semibold shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/60"
                            aria-label="View Leads"
                          >
                            <FiDatabase className="w-5 h-5" />
                            View Leads
                          </button>
                        ) : (
                          <>
                            <button
                              className="flex items-center gap-2 px-4 py-2 rounded bg-white border border-green-400 text-green-600 font-semibold shadow hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400"
                              aria-label="Accept"
                            >
                              <FiCheckCircle className="w-5 h-5" />
                              Accept
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 rounded bg-white border border-red-300 text-red-500 font-semibold shadow hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300"
                              aria-label="Reject"
                            >
                              <FiTrash2 className="w-5 h-5" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </BaseCard>

      {/* ===================== Edit Permissions Modal ===================== */}
      {isEditModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm backdrop-saturate-150 transition-all">
          <div
            className="bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-md p-0 relative animate-fadeInScale mx-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-permissions-modal-title"
          >
            <div className="px-6 py-4 bg-white border-b border-gray-100 rounded-t-2xl">
              <h2
                id="edit-permissions-modal-title"
                className="text-lg font-bold text-gray-900 tracking-wide"
              >
                Edit Permissions for {selectedClient.email}
              </h2>
            </div>
            <form
              onSubmit={handleEditFormSubmit(onEditSubmit)}
              aria-label="Edit Client Permissions Form"
              className="space-y-4 px-6 py-6"
              noValidate
            >
              <input type="hidden" {...editRegister("permissions")} />
              <div className="flex flex-col gap-3 mt-1">
                {permissionsList.map((perm) => {
                  const Icon = perm.icon;
                  const checked = editWatchedPermissions.includes(perm.value);
                  const isReadRequired =
                    editWatchedPermissions.includes("update") ||
                    editWatchedPermissions.includes("delete");
                  return (
                    <label
                      key={perm.value}
                      className="inline-flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="accent-black w-4 h-4"
                        checked={checked}
                        onChange={() => handleEditPermissionChange(perm.value)}
                        disabled={
                          perm.value === "read" && isReadRequired && checked
                        }
                        aria-label={perm.label}
                      />
                      <Icon className="w-4 h-4" />
                      <span className="text-base">{perm.label}</span>
                    </label>
                  );
                })}
                {editErrors.permissions && (
                  <span className="text-red-500 text-sm mt-1">
                    {editErrors.permissions.message as string}
                  </span>
                )}
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md font-semibold shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 cursor-pointer"
                  aria-label="Save Permissions"
                >
                  <FiCheckCircle className="w-5 h-5" aria-hidden="true" />
                  Save
                </button>
              </div>
            </form>
          </div>
          <style jsx>{`
            .animate-fadeInScale {
              animation: fadeInScale 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            }
            @keyframes fadeInScale {
              0% {
                opacity: 0;
                transform: scale(0.95);
              }
              100% {
                opacity: 1;
                transform: scale(1);
              }
            }
          `}</style>
        </div>
      )}

      {/* ===================== Confirm Delete Modal ===================== */}
      {isDeleteModalOpen && clientToDelete && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Delete Client Access"
          description={`Are you sure you want to remove this access? This action cannot be undone.`}
        />
      )}
    </div>
  );
}

export default AccessManagementPage;
