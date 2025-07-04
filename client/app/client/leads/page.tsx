"use client";
import Header from "@/components/layout/Header";
import SideBar from "@/components/layout/SideBar";
import { useState } from "react";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import BaseTable, { BaseTableColumn } from "@/components/ui/tables/BaseTable";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";

// Fake data type
const fakeLeads = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    source: "Website",
    status: "new",
    createdAt: "2023-01-01",
  },
  {
    id: 2,
    name: "",
    email: "jane@example.com",
    phone: "",
    source: "Referral",
    status: "contacted",
    createdAt: "2023-01-02",
  },
  {
    id: 3,
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "9876543210",
    source: "Ad Campaign",
    status: "converted",
    createdAt: "2023-01-03",
  },
  {
    id: 4,
    name: "Bob Lee",
    email: "bob@example.com",
    phone: "",
    source: "",
    status: "lost",
    createdAt: "2023-01-04",
  },
  {
    id: 5,
    name: "",
    email: "eve@example.com",
    phone: "5551234567",
    source: "Website",
    status: "new",
    createdAt: "2023-01-05",
  },
  {
    id: 6,
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "",
    source: "Event",
    status: "contacted",
    createdAt: "2023-01-06",
  },
  {
    id: 7,
    name: "",
    email: "dave@example.com",
    phone: "",
    source: "",
    status: "converted",
    createdAt: "2023-01-07",
  },
  {
    id: 8,
    name: "Emily White",
    email: "emily@example.com",
    phone: "4445556666",
    source: "Referral",
    status: "lost",
    createdAt: "2023-01-08",
  },
];

const rowsPerPageOptions = [8, 16, 32];

const statusStyles: Record<string, string> = {
  new: "bg-blue-100 text-blue-600",
  contacted: "bg-yellow-100 text-yellow-600",
  converted: "bg-green-100 text-green-600",
  lost: "bg-red-100 text-red-600",
};

const columns: BaseTableColumn[] = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "source", label: "Source" },
  { key: "status", label: "Status" },
  { key: "createdAt", label: "Created At" },
  {
    key: "actions",
    label: "Actions",
    className:
      "px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider",
  },
];

const Leads = () => {
  const [isLeftBarOpen, setIsLeftBarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const totalRows = 1240; // Example total

  // ConfirmDeleteModal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<number | null>(null);

  const handleView = (id: number) => {
    alert(`View lead ${id}`);
  };
  const handleEdit = (id: number) => {
    alert(`Modify lead ${id}`);
  };
  const handleDelete = (id: number) => {
    setDeletingLeadId(id);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = () => {
    // Here you would call your delete API or logic
    setIsDeleteModalOpen(false);
    setDeletingLeadId(null);
  };
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingLeadId(null);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <SideBar
        activeLabel="Leads"
        isOpen={isLeftBarOpen}
        onClose={() => setIsLeftBarOpen(!isLeftBarOpen)}
        role="client"
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <Header
          title="Leads"
          username="mikari alias"
          onMenuClick={() => setIsLeftBarOpen(!isLeftBarOpen)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 bg-gray-50">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">All Leads</h2>
              <button
                className="bg-green-500 text-white px-5 py-2 rounded-full shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer"
                tabIndex={0}
                aria-label="Add New Lead"
              >
                Add New
              </button>
            </div>
            <div className="overflow-x-auto">
              <BaseTable
                columns={columns}
                data={fakeLeads}
                rowKey={(row) => row.id}
                renderCell={(row, colKey) => {
                  if (colKey === "name") {
                    return (
                      row.name || (
                        <span className="text-gray-400 italic">—</span>
                      )
                    );
                  }
                  if (colKey === "phone" || colKey === "source") {
                    return (
                      row[colKey] || (
                        <span className="text-gray-400 italic">—</span>
                      )
                    );
                  }
                  if (colKey === "status") {
                    return (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          statusStyles[row.status]
                        }`}
                      >
                        {row.status.charAt(0).toUpperCase() +
                          row.status.slice(1)}
                      </span>
                    );
                  }
                  if (colKey === "actions") {
                    return (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(row.id)}
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
                        <button
                          onClick={() => handleEdit(row.id)}
                          tabIndex={0}
                          aria-label={`Modify lead ${row.email}`}
                          title="Modify"
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
                          aria-label={`Delete lead ${row.email}`}
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
          {/* Confirm Delete Modal */}
          <ConfirmDeleteModal
            isOpen={isDeleteModalOpen}
            onClose={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            title="Delete Lead"
            description="Are you sure you want to delete this lead? This action cannot be undone."
            confirmLabel="Delete"
            cancelLabel="Cancel"
          />
        </main>
      </div>
    </div>
  );
};

export default Leads;
