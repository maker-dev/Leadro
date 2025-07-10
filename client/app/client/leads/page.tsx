"use client";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaEye, FaDownload, FaSearch } from "react-icons/fa";
import BaseTable, { BaseTableColumn } from "@/components/ui/tables/BaseTable";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import ConfirmDownloadModal from "@/components/modals/ConfirmDownloadModal";
import Link from "next/link";
import { usePageContext } from "@/context/PageTitleContext";

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
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Leads");
    setTitle("Leads");
  }, [setLabel, setTitle]);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const totalRows = 1240; // Example total

  // ConfirmDeleteModal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<number | null>(null);

  // ConfirmDownloadModal state
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Search bar state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const handleSearch = () => {
    // Call API or handle search logic here
    console.log("Search triggered for:", searchTerm);
  };
  const handleSearchInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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

  const handleDownloadClick = () => {
    setIsDownloadModalOpen(true);
  };
  const handleConfirmDownload = () => {
    setIsDownloadModalOpen(false);
  };
  const handleCancelDownload = () => {
    setIsDownloadModalOpen(false);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mb-6 gap-3">
        <div className="flex items-center gap-2 mb-1 sm:mb-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            All Leads
          </h2>
          <button
            className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            tabIndex={0}
            aria-label="Download Leads"
            title="Download Leads"
            onClick={handleDownloadClick}
          >
            <FaDownload className="text-blue-500" size={18} />
          </button>
        </div>
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            tabIndex={0}
            className="px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 transition cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <Link href={`/client/leads/create/`} passHref>
            <button
              className="bg-green-500 text-white px-5 py-2 rounded-full shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer"
              tabIndex={0}
              aria-label="Add New Lead"
            >
              Add New
            </button>
          </Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <BaseTable
          columns={columns}
          data={fakeLeads}
          rowKey={(row) => row.id}
          renderCell={(row, colKey) => {
            if (colKey === "name") {
              return (
                row.name || <span className="text-gray-400 italic">—</span>
              );
            }
            if (colKey === "phone" || colKey === "source") {
              return (
                row[colKey] || <span className="text-gray-400 italic">—</span>
              );
            }
            if (colKey === "status") {
              return (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    statusStyles[row.status]
                  }`}
                >
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                </span>
              );
            }
            if (colKey === "actions") {
              return (
                <div className="flex justify-end gap-2">
                  <Link href={`/client/leads/view/${row.id}`} passHref>
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
                  <Link href={`/client/leads/update/${row.id}`} passHref>
                    <button
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
                  </Link>
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
      {/* Confirm Download Modal */}
      <ConfirmDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={handleCancelDownload}
        onConfirm={handleConfirmDownload}
        title="Download Leads"
        description="Are you sure you want to download the selected leads?"
        confirmLabel="Download"
        cancelLabel="Cancel"
      />
    </div>
  );
};

export default Leads;
