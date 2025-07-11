"use client";
import { useEffect } from "react";
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
import FormValues from "./types/InviteClientType";

const permissionsList = [
  { value: "read", label: "Read", icon: FiEye },
  { value: "update", label: "Update", icon: FiEdit2 },
  { value: "delete", label: "Delete", icon: FiTrash2 },
] as const;
type Perm = (typeof permissionsList)[number]["value"];

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
  const { setLabel, setTitle } = usePageContext();
  useEffect(() => {
    setLabel("Access Management");
    setTitle("Access Management");
  }, [setLabel, setTitle]);

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

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Invite Client Card */}
      <div className="p-8 bg-white rounded-xl border border-gray-200 shadow">
        <div className="flex items-center mb-2">
          <FiUserPlus className="w-6 h-6 mr-2" aria-label="Invite a Client" />
          <h2 className="text-xl sm:text-2xl font-bold">Invite a Client</h2>
        </div>
        <p className="text-gray-500 mb-8">
          Send an invitation to share your leads with another client.
        </p>
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
      </div>

      {/* Clients I've Shared With Card */}
      <div className="p-8 bg-white rounded-xl border border-gray-200 shadow">
        <div className="flex items-center mb-2">
          <FiShare2
            className="w-6 h-6 mr-2"
            aria-label="Clients I've Shared With"
          />
          <h2 className="text-xl sm:text-2xl font-bold">
            Clients I've Shared With
          </h2>
        </div>
        <p className="text-gray-500 mb-8">
          Manage access permissions for clients you've invited.
        </p>
        <div className="overflow-x-auto">
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
                      >
                        <FiEdit3 className="w-5 h-5" />
                      </button>
                      <button
                        className="p-2 rounded border border-gray-200 hover:bg-gray-100 text-red-500"
                        aria-label="Delete"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Clients Who Shared With Me Card */}
      <div className="p-8 bg-white rounded-xl border border-gray-200 shadow">
        <div className="flex items-center mb-2">
          <LuUsers
            className="w-6 h-6 mr-2"
            aria-label="Clients Who Shared With Me"
          />
          <h2 className="text-xl sm:text-2xl font-bold">
            Clients Who Shared With Me
          </h2>
        </div>
        <p className="text-gray-500 mb-8">
          View leads shared by other clients and manage invitation requests.
        </p>
        <div className="overflow-x-auto">
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
        </div>
      </div>
    </div>
  );
}

export default AccessManagementPage;
