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
  FiLoader,
} from "react-icons/fi";
import { LuUsers } from "react-icons/lu";
import Link from "next/link";
import formSchema from "./schemas/InviteClientSchema";
import EditPermissionsFormSchema from "./schemas/EditPermissionsSchema";
import EditPermissionsFormValues from "./types/EditPermissionsType";
import FormValues from "./types/InviteClientType";
import BaseCard from "@/components/ui/cards/BaseCard";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import {
  inviteClient,
  getSharedWithMe,
  getSharedByMe,
  updateClientAccess,
  deleteClientAccess,
  respondToInvitation,
} from "@/services/ClientAccessService";
import { toast } from "sonner";

// ===================== Permissions List & Types =====================
const permissionsList = [
  { value: "read", label: "Read", icon: FiEye },
  { value: "update", label: "Update", icon: FiEdit2 },
  { value: "delete", label: "Delete", icon: FiTrash2 },
] as const;
type Perm = (typeof permissionsList)[number]["value"];

// ===================== Data Types =====================
interface SharedAccess {
  id: string;
  owner?: {
    _id: string;
    name: string;
    email: string;
  };
  sharedWith?: {
    _id: string;
    name: string;
    email: string;
  };
  permissions: string[];
  sharedAt: string;
  status: "pending" | "active";
}

function AccessManagementPage() {
  // ===================== Page Title Context =====================
  const { setLabel, setTitle } = usePageContext();
  useEffect(() => {
    setLabel("Access Management");
    setTitle("Access Management");
  }, [setLabel, setTitle]);

  // ===================== Data State =====================
  const [sharedByMe, setSharedByMe] = useState<SharedAccess[]>([]);
  const [sharedWithMe, setSharedWithMe] = useState<SharedAccess[]>([]);
  const [isLoadingSharedByMe, setIsLoadingSharedByMe] = useState(true);
  const [isLoadingSharedWithMe, setIsLoadingSharedWithMe] = useState(true);

  // ===================== Fetch Data =====================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sharedByMeData, sharedWithMeData] = await Promise.all([
          getSharedByMe(),
          getSharedWithMe(),
        ]);

        if (sharedByMeData.success) {
          setSharedByMe(sharedByMeData.data);
        }
        if (sharedWithMeData.success) {
          setSharedWithMe(sharedWithMeData.data);
        }
      } catch (error: any) {
        console.error("Error fetching sharing data:", error);
        toast.error("Failed to load sharing data");
      } finally {
        setIsLoadingSharedByMe(false);
        setIsLoadingSharedWithMe(false);
      }
    };

    fetchData();
  }, []);

  // ===================== Invite Client Form (react-hook-form) =====================
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
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

  const onSubmit = async (data: FormValues) => {
    try {
      await inviteClient({
        email: data.email,
        permissions: data.permissions,
      });

      toast.success("Invitation sent successfully!");

      // Refresh the shared by me data to show the new invitation
      const sharedByMeData = await getSharedByMe();
      if (sharedByMeData.success) {
        setSharedByMe(sharedByMeData.data);
      }

      // Reset form after successful submission
      setValue("email", "");
      setValue("permissions", []);
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.field && err.message) {
            setError(err.field, { type: "server", message: err.message });
          } else if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to invite client. Please try again.");
      }
    }
  };

  // ===================== Edit Permissions Modal State =====================
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<null | SharedAccess>(
    null
  );

  // ===================== Edit Permissions Modal Form (react-hook-form) =====================
  const {
    register: editRegister,
    handleSubmit: handleEditFormSubmit,
    formState: { errors: editErrors, isSubmitting: isEditSubmitting },
    setValue: setEditValue,
    watch: editWatch,
    reset: editReset,
  } = useForm<EditPermissionsFormValues>({
    resolver: zodResolver(EditPermissionsFormSchema),
    defaultValues: { permissions: [] },
    mode: "onBlur",
  });

  // ===================== Edit Permissions Modal Handlers =====================
  const handleOpenEditModal = (client: SharedAccess) => {
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

  const onEditSubmit = async (data: EditPermissionsFormValues) => {
    if (!selectedClient) return;

    try {
      await updateClientAccess({
        id: selectedClient.id,
        permissions: data.permissions,
      });

      toast.success("Permissions updated successfully!");

      // Refresh the data
      const sharedByMeData = await getSharedByMe();
      if (sharedByMeData.success) {
        setSharedByMe(sharedByMeData.data);
      }

      handleCloseEditModal();
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to update permissions. Please try again.");
      }
    }
  };

  // ===================== Delete Modal State =====================
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<null | SharedAccess>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // ===================== Delete Modal Handlers =====================
  const handleOpenDeleteModal = (client: SharedAccess) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setClientToDelete(null);
  };

  // ===================== Respond to Invitation Handlers =====================
  const [respondingToInvitation, setRespondingToInvitation] = useState<{ id: string; action: "accept" | "reject" } | null>(null);

  const handleRespondToInvitation = async (
    client: SharedAccess,
    action: "accept" | "reject"
  ) => {
    setRespondingToInvitation({ id: client.id, action });
    try {
      await respondToInvitation({
        id: client.id,
        action: action,
      });

      const actionText = action === "accept" ? "accepted" : "rejected";
      toast.success(`Invitation ${actionText} successfully!`);

      // Refresh the data
      const sharedWithMeData = await getSharedWithMe();
      if (sharedWithMeData.success) {
        setSharedWithMe(sharedWithMeData.data);
      }
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error(`Failed to ${action} invitation. Please try again.`);
      }
    } finally {
      setRespondingToInvitation(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!clientToDelete) return;

    try {
      setIsDeleting(true);
      await deleteClientAccess(clientToDelete.id);

      toast.success("Client access removed successfully!");

      // Refresh the data
      const sharedByMeData = await getSharedByMe();
      if (sharedByMeData.success) {
        setSharedByMe(sharedByMeData.data);
      }

      handleCloseDeleteModal();
    } catch (error: any) {
      const errors = error?.response?.data?.errors;
      if (Array.isArray(errors)) {
        errors.forEach((err: any) => {
          if (err.message) {
            toast.error(err.message);
          }
        });
      } else if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Failed to remove client access. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
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
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md font-semibold shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Send Invitation"
            >
              {isSubmitting ? (
                <>
                  <FiLoader className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiMail className="w-5 h-5" aria-hidden="true" />
                  Send Invitation
                </>
              )}
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
          {isLoadingSharedByMe ? (
            <div className="flex flex-col items-center justify-center min-h-[120px] text-center">
              <FiLoader className="w-8 h-8 animate-spin text-gray-400 mb-2" />
              <div className="text-gray-500">Loading shared clients...</div>
            </div>
          ) : sharedByMe.length === 0 ? (
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
            <table className="min-w-[700px] table-fixed w-full text-left">
              <colgroup>
                <col className="min-w-[120px] md:w-2/6" />
                <col className="min-w-[100px] md:w-1/6" />
                <col className="min-w-[100px] md:w-1/6" />
                <col className="min-w-[100px] md:w-1/6" />
                <col className="min-w-[100px] md:w-1/6" />
              </colgroup>
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-300">
                  <th className="py-2 px-2 font-semibold min-w-[120px] md:w-2/6">
                    Client
                  </th>
                  <th className="py-2 px-2 font-semibold min-w-[100px] md:w-1/6">
                    Permissions
                  </th>
                  <th className="py-2 px-2 font-semibold min-w-[100px] md:w-1/6">
                    Status
                  </th>
                  <th className="py-2 px-2 font-semibold min-w-[100px] md:w-1/6">
                    Invited Date
                  </th>
                  <th className="py-2 px-2 font-semibold min-w-[100px] md:w-1/6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sharedByMe.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 px-2 font-medium text-gray-900">
                      {client.sharedWith?.email}
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
                      {client.status === "active" ? (
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
                    <td className="py-3 px-2">
                      {new Date(client.sharedAt).toLocaleDateString()}
                    </td>
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
          {isLoadingSharedWithMe ? (
            <div className="flex flex-col items-center justify-center min-h-[120px] text-center">
              <FiLoader className="w-8 h-8 animate-spin text-gray-400 mb-2" />
              <div className="text-gray-500">Loading shared clients...</div>
            </div>
          ) : sharedWithMe.length === 0 ? (
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
            <table className="min-w-[700px] table-fixed w-full text-left">
              <colgroup>
                <col className="min-w-[120px] md:w-2/6" />
                <col className="min-w-[100px] md:w-1/6" />
                <col className="min-w-[100px] md:w-1/6" />
                <col className="min-w-[100px] md:w-1/6" />
                <col className="min-w-[100px] md:w-1/6" />
              </colgroup>
              <thead>
                <tr className="text-gray-500 text-sm border-b border-gray-300">
                  <th className="py-2 px-2 font-semibold min-w-[120px] md:w-2/6">
                    Client
                  </th>
                  <th className="py-2 px-2 font-semibold min-w-[100px] md:w-1/6">
                    Permissions
                  </th>
                  <th className="py-2 px-2 font-semibold min-w-[100px] md:w-1/6">
                    Status
                  </th>
                  <th className="py-2 px-2 font-semibold min-w-[100px] md:w-1/6">
                    Shared Date
                  </th>
                  <th className="py-2 px-2 font-semibold min-w-[100px] md:w-1/6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sharedWithMe.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-gray-100 last:border-0"
                  >
                    <td className="py-3 px-2 font-medium text-gray-900">
                      <div className="flex flex-col">
                        <span>{client.owner?.name}</span>
                        <span className="text-xs text-gray-500">
                          {client.owner?.email}
                        </span>
                      </div>
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
                      {client.status === "active" ? (
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
                    <td className="py-3 px-2">
                      {new Date(client.sharedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        {client.status === "active" ? (
                          <Link
                            href="/client/leads"
                            className="flex items-center gap-2 px-4 py-2 rounded bg-white border border-gray-200 text-gray-900 font-semibold shadow hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black/60 transition-colors w-full md:w-auto text-sm md:text-base justify-center whitespace-nowrap min-w-[120px]"
                            aria-label="View Leads"
                          >
                            <FiDatabase className="w-5 h-5 flex-shrink-0" />
                            View Leads
                          </Link>
                        ) : (
                          <>
                            <button
                              className="flex items-center gap-2 px-4 py-2 rounded bg-white border border-green-400 text-green-600 font-semibold shadow hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Accept"
                              onClick={() =>
                                handleRespondToInvitation(client, "accept")
                              }
                              disabled={respondingToInvitation?.id === client.id}
                            >
                              {respondingToInvitation?.id === client.id && respondingToInvitation?.action === "accept" ? (
                                <>
                                  <FiLoader className="w-5 h-5 animate-spin" />
                                  Accepting...
                                </>
                              ) : (
                                <>
                                  <FiCheckCircle className="w-5 h-5" />
                                  Accept
                                </>
                              )}
                            </button>
                            <button
                              className="flex items-center gap-2 px-4 py-2 rounded bg-white border border-red-300 text-red-500 font-semibold shadow hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Reject"
                              onClick={() =>
                                handleRespondToInvitation(client, "reject")
                              }
                              disabled={respondingToInvitation?.id === client.id}
                            >
                              {respondingToInvitation?.id === client.id && respondingToInvitation?.action === "reject" ? (
                                <>
                                  <FiLoader className="w-5 h-5 animate-spin" />
                                  Rejecting...
                                </>
                              ) : (
                                <>
                                  <FiTrash2 className="w-5 h-5" />
                                  Reject
                                </>
                              )}
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
                Edit Permissions for {selectedClient?.sharedWith?.email}
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
                  disabled={isEditSubmitting}
                  className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-md font-semibold shadow hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black/60 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                  aria-label="Save Permissions"
                >
                  {isEditSubmitting ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-5 h-5" aria-hidden="true" />
                      Save
                    </>
                  )}
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
          loading={isDeleting}
        />
      )}
    </div>
  );
}

export default AccessManagementPage;
