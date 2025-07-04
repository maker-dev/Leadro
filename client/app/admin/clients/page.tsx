"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import BaseTable, { BaseTableColumn } from "@/components/ui/tables/BaseTable";
import CreateFormModal, { FieldConfig } from "@/components/modals/FormModal";
import { formSchema } from "@/app/register/schema";
import { FormValues } from "@/app/register/types";

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

const initialClientValues: FormValues = {
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
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Pagination logic (UI only)
  const totalRows = 1240; // Example total
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleAddClient = (formData: FormValues) => {
    // Handle form data (API call, etc.)
    console.log(formData);
    setIsAddClientOpen(false);
  };

  const handleEdit = (id: number) => {
    alert(`Edit client ${id}`);
  };

  const handleDelete = (id: number) => {
    alert(`Delete client ${id}`);
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

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar
        activeLabel="Clients"
        isOpen={isLeftBarOpen}
        onClose={() => setIsLeftBarOpen(!isLeftBarOpen)}
        role="admin"
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          title="Clients"
          username="mikari alias"
          onMenuClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">All Clients</h2>
              <button
                className="bg-green-500 text-white px-5 py-2 rounded-full shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer"
                tabIndex={0}
                aria-label="Add New Client"
                onClick={() => setIsAddClientOpen(true)}
              >
                Add New
              </button>
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
          </div>
          <CreateFormModal
            isOpen={isAddClientOpen}
            onClose={() => setIsAddClientOpen(false)}
            onSubmit={handleAddClient}
            title="Add Client"
            fields={clientFields}
            initialValues={initialClientValues}
            validationSchema={formSchema}
            submitLabel="Add Client"
            cancelLabel="Cancel"
          />
        </main>
      </div>
    </div>
  );
}

export default ClientsPage;
