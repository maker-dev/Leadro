"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import BaseTable, { BaseTableColumn } from "@/components/ui/tables/BaseTable";
import FormModal, { FieldConfig } from "@/components/modals/FormModal";
import AddFormSchema from "./schemas/AddClientSchema";
import AddFormValues from "./types/AddClientType";
import EditFormSchema from "./schemas/EditClientSchema";
import EditFormValues from "./types/EditClientType";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

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

// Fake data type
const fakeClients = [
  {
    id: 1,
    name: "Acuity Infotech FZCO",
    email: "info@acuity.ae",
    createdAt: "2023-01-01",
  },
  {
    id: 2,
    name: "ABC Infotech",
    email: "info@abcinfotech.com",
    createdAt: "2023-01-02",
  },
  {
    id: 3,
    name: "NEW Infotech",
    email: "info@newinfotech.in",
    createdAt: "2023-01-03",
  },
  {
    id: 4,
    name: "ABC Infotech 2",
    email: "info2@acuity.ae",
    createdAt: "2023-01-04",
  },
  {
    id: 5,
    name: "ABC Infotech 3",
    email: "info3@acuity.ae",
    createdAt: "2023-01-05",
  },
  {
    id: 6,
    name: "ABC Infotech 4",
    email: "info4@acuity.ae",
    createdAt: "2023-01-06",
  },
  {
    id: 7,
    name: "ABC Infotech 5",
    email: "info5@acuity.ae",
    createdAt: "2023-01-07",
  },
  {
    id: 8,
    name: "ABC Infotech 6",
    email: "info6@acuity.ae",
    createdAt: "2023-01-08",
  },
];

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
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<EditFormValues | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingClientId, setDeletingClientId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination logic (UI only)
  const totalRows = 1240; // Example total
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleAddClient = (formData: AddFormValues) => {
    // Handle form data (API call, etc.)
    console.log("Add Client", formData);
    setIsAddClientOpen(false);
  };

  const handleEdit = (id: number) => {
    const client = fakeClients.find((c) => c.id === id);
    if (client) {
      setEditingClient({
        name: client.name,
        email: client.email,
      });
      setIsEditClientOpen(true);
    }
  };

  const handleUpdateClient = (formData: EditFormValues) => {
    // Handle update logic (API call, etc.)
    console.log("Update Client", formData);
    setIsEditClientOpen(false);
    setEditingClient(null);
  };

  const handleDelete = (id: number) => {
    setDeletingClientId(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deletingClientId !== null) {
      // Handle delete logic (API call, etc.)
      console.log("Delete client", deletingClientId);
    }
    setIsDeleteModalOpen(false);
    setDeletingClientId(null);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  };

  const handleSearch = () => {
    // Call API with searchTerm or handle search logic here
    console.log("Search triggered for:", searchTerm);
  };

  const handleSearchInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full mb-6 gap-3">
        <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
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
      <div className="overflow-x-auto">
        <BaseTable
          columns={columns}
          data={fakeClients}
          rowKey={(row) => row.id}
          renderCell={(row, colKey) => {
            if (colKey === "actions") {
              return (
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(row.id)}
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
                    onClick={() => handleDelete(row.id)}
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
          totalRows={totalRows}
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
        validationSchema={EditFormSchema}
        submitLabel="Update Client"
        cancelLabel="Cancel"
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingClientId(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Client"
        description="Are you sure you want to delete this client? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </div>
  );
}

export default ClientsPage;
