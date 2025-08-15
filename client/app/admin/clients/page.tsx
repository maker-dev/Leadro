"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import BaseTable, { BaseTableColumn } from "@/components/ui/tables/BaseTable";
import FormModal, { FieldConfig } from "@/components/modals/FormModal";
import AddFormSchema from "./schemas/AddClientSchema";
import AddFormValues from "./types/AddClientType";
import EditFormSchema from "./schemas/EditClientSchema";
import EditFormValues from "./types/EditClientType";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import { usePageContext } from "@/context/PageTitleContext";
import { getAllClientsWithPagination, updateClientProfile, getClientById, deleteClient } from "@/services/AdminService";
import { registerUser } from "@/services/AuthService";
import Link from "next/link";
import { toast } from "sonner";

const clientFields: FieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Nanyonga Rahmah",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "ugaka1204@gmail.com",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Password",
    required: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm Password",
    required: true,
  },
];

const editFields: FieldConfig[] = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Nanyonga Rahmah",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "ugaka1204@gmail.com",
    required: true,
  },
];

const initialClientValues: AddFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};



const rowsPerPageOptions = [8, 16, 32];

const columns: BaseTableColumn[] = [
  { key: "name", label: "Client" },
  { key: "email", label: "Email" },
  { key: "createdAt", label: "Created At" },
  {
    key: "actions",
    label: "Actions",
    className:
      "px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider",
  },
];

function ClientsPage() {
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Clients");
    setTitle("Clients");
  }, [setLabel, setTitle]);

  // API data state
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 8,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  // UI state
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<EditFormValues & { id?: string } | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<string | null>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  


  // Load clients on component mount and when pagination or search changes
  useEffect(() => {
    loadClients();
  }, [page, rowsPerPage, appliedSearch]);

  const loadClients = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: rowsPerPage,
        search: appliedSearch || undefined,
      };

      const response = await getAllClientsWithPagination(params);
      setClients(response.data.clients);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast.error("Failed to load clients");
      console.error("Error loading clients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClient = async (
    formData: AddFormValues,
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
      // Call the registerUser API to create a new client
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      toast.success("Client created successfully");
      
      // Reload the clients to reflect the new client
      await loadClients();
      
      // Close modal
      setIsAddClientOpen(false);
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
        toast.error("Failed to create client. Please try again.");
      }
      
      // Only close modal if there are no field errors
      if (!hasFieldError) {
        setIsAddClientOpen(false);
      }
      // Don't reset form on error - let user see their input and fix the error
    }
  };

  const handleEdit = async (id: string) => {
    try {
      // Fetch the latest client data from the API
      const response = await getClientById(id);
      const client = response.data;
      
      if (client) {
        setEditingClient({
          id: client._id || client.id,
          name: client.name,
          email: client.email,
        });
        setIsEditClientOpen(true);
      }
    } catch (error: any) {
      toast.error("Failed to load client details");
      console.error("Error loading client details:", error);
    }
  };

  const handleUpdateClient = async (
    formData: EditFormValues,
    {
      setError,
    }: {
      setError: (
        field: string,
        error: { type: string; message: string }
      ) => void;
    }
  ) => {
    if (!editingClient) return;

    try {
      // Call the updateClientProfile API
      await updateClientProfile(editingClient.id!, {
        name: formData.name,
        email: formData.email,
      });

      toast.success("Client updated successfully");
      
      // Reload the clients to reflect the changes
      await loadClients();
      
      // Close modal and reset state
      setIsEditClientOpen(false);
      setEditingClient(null);
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
        toast.error("Failed to update client. Please try again.");
      }
      
      // Only close modal if there are no field errors
      if (!hasFieldError) {
        setIsEditClientOpen(false);
        setEditingClient(null);
      }
      // Don't reset form on error - let user see their input and fix the error
    }
  };

  const handleDelete = (id: string) => {
    setDeletingClientId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingClientId) return;

    try {
      setLoadingDelete(true);
      // Call the deleteClient API
      await deleteClient(deletingClientId);
      toast.success("Client deleted successfully");
      
      // Reload the clients to reflect the deletion
      await loadClients();
    } catch (error: any) {
      toast.error("Failed to delete client");
      console.error("Error deleting client:", error);
    } finally {
      setLoadingDelete(false);
      setIsDeleteModalOpen(false);
      setDeletingClientId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingClientId(null);
  };



  const handleSearch = () => {
    setAppliedSearch(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  const handleSearchInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearchBlur = () => {
    handleSearch();
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-6 gap-3">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
          All Clients
        </h2>
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <div className="relative w-full sm:w-56">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSearch
                className="text-gray-400"
                size={16}
                aria-hidden="true"
              />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchInputKeyDown}
              onBlur={handleSearchBlur}
              placeholder="Search..."
              aria-label="Search..."
              tabIndex={0}
              className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full text-sm"
            />
          </div>
          <button
            className="bg-green-500 text-white px-5 py-2 rounded-full shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer"
            tabIndex={0}
            aria-label="Add New Client"
            onClick={() => setIsAddClientOpen(true)}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-gray-700 font-medium">
                Loading clients...
              </span>
            </div>
          </div>
        )}
        <BaseTable
          columns={columns}
          data={clients}
          rowKey={(row) => row._id || row.id}
          renderCell={(row, colKey) => {
            if (colKey === "createdAt") {
              return new Date(row.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
            }
            if (colKey === "actions") {
              return (
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/clients/view/${row._id || row.id}`} passHref>
                    <button
                      tabIndex={0}
                      aria-label={`View lead ${row.email}`}
                      title="View"
                      className="group p-2 rounded-full bg-gray-100 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                      <FaEye
                        className="text-blue-500 group-hover:text-blue-600"
                        size={18}
                      />
                    </button>
                  </Link>
                  <button
                    onClick={() => handleEdit(row._id || row.id)}
                    tabIndex={0}
                    aria-label={`Edit ${row.name}`}
                    title="Edit"
                    className="group p-2 rounded-full bg-gray-100 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  >
                    <FaEdit
                      className="text-yellow-500 group-hover:text-yellow-600"
                      size={18}
                    />
                  </button>
                  <button
                    onClick={() => handleDelete(row._id || row.id)}
                    tabIndex={0}
                    aria-label={`Delete ${row.name}`}
                    title="Delete"
                    className="group p-2 rounded-full bg-gray-100 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                  >
                    <FaTrash
                      className="text-red-500 group-hover:text-red-600"
                      size={18}
                    />
                  </button>
                </div>
              );
            }
            // @ts-ignore
            return row[colKey];
          }}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRows={pagination.totalItems}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
        />
      </div>
      <FormModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onSubmit={handleAddClient}
        title="Add Client"
        fields={clientFields}
        initialValues={initialClientValues}
        validationSchema={AddFormSchema}
        submitLabel="Add Client"
        cancelLabel="Cancel"
      />
             <FormModal
         isOpen={isEditClientOpen}
         onClose={() => {
           setIsEditClientOpen(false);
           setEditingClient(null);
         }}
         onSubmit={handleUpdateClient}
         title="Edit Client"
         fields={editFields}
         initialValues={editingClient || { name: "", email: "" }}
         key={editingClient?.id || "empty"} // Force re-render when editingClient changes
         validationSchema={EditFormSchema}
         submitLabel="Update Client"
         cancelLabel="Cancel"
       />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        loading={loadingDelete}
      />
    </div>
  );
}

export default ClientsPage;
