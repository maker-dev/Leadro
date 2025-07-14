"use client";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaDownload,
  FaSearch,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { FiFilter, FiShare2 } from "react-icons/fi";
import BaseTable, { BaseTableColumn } from "@/components/ui/tables/BaseTable";
import ConfirmDeleteModal from "@/components/modals/ConfirmDeleteModal";
import ConfirmDownloadModal from "@/components/modals/ConfirmDownloadModal";
import Link from "next/link";
import { usePageContext } from "@/context/PageTitleContext";

// Fake data type (now includes owner info)
const fakeLeads = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    source: "Website",
    status: "new",
    createdAt: "2023-01-01",
    owner: "me", // owned by current client
  },
  {
    id: 2,
    name: "",
    email: "jane@example.com",
    phone: "",
    source: "Referral",
    status: "contacted",
    createdAt: "2023-01-02",
    owner: "shared",
    sharedBy: "Acme Corp",
  },
  {
    id: 3,
    name: "Alice Smith",
    email: "alice@example.com",
    phone: "9876543210",
    source: "Ad Campaign",
    status: "converted",
    createdAt: "2023-01-03",
    owner: "me",
  },
  {
    id: 4,
    name: "Bob Lee",
    email: "bob@example.com",
    phone: "",
    source: "",
    status: "lost",
    createdAt: "2023-01-04",
    owner: "shared",
    sharedBy: "Beta LLC",
  },
  {
    id: 5,
    name: "",
    email: "eve@example.com",
    phone: "5551234567",
    source: "Website",
    status: "new",
    createdAt: "2023-01-05",
    owner: "me",
  },
  {
    id: 6,
    name: "Charlie Brown",
    email: "charlie@example.com",
    phone: "",
    source: "Event",
    status: "contacted",
    createdAt: "2023-01-06",
    owner: "shared",
    sharedBy: "Gamma Inc",
  },
  {
    id: 7,
    name: "",
    email: "dave@example.com",
    phone: "",
    source: "",
    status: "converted",
    createdAt: "2023-01-07",
    owner: "me",
  },
  {
    id: 8,
    name: "Emily White",
    email: "emily@example.com",
    phone: "4445556666",
    source: "Referral",
    status: "lost",
    createdAt: "2023-01-08",
    owner: "shared",
    sharedBy: "Acme Corp",
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
  { key: "owner", label: "Owner" },
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
  //Defining the current page
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Leads");
    setTitle("Leads");
  }, [setLabel, setTitle]);

  //filter state
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [startDate, endDate] = dateRange;
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("anyone");

  //ui state
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<number | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleApplyDate = () => setIsDatePickerOpen(false);
  const handleClearDate = () => {
    setDateRange([null, null]);
    setIsDatePickerOpen(false);
  };

  //pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const totalRows = 1240; // Example total

  // functions
  const handleSearch = () => {
    // Call API or handle search logic here
    console.log({
      searchTerm,
      statusFilter,
      startDate,
      endDate,
      ownerFilter,
    });
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
    <div className="w-full">
      {/* Filter Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <FiFilter className="text-gray-700" size={24} />
            <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
          </div>
          <p className="text-gray-500 text-sm">
            Filter leads by various criteria
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Search Bar */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="lead-search"
            >
              Search
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch
                  className="text-gray-400"
                  size={16}
                  aria-hidden="true"
                />
              </span>
              <input
                id="lead-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchInputKeyDown}
                placeholder="Search leads..."
                aria-label="Search leads"
                tabIndex={0}
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full text-sm"
              />
            </div>
          </div>
          {/* Status Dropdown */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="status-filter"
            >
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
              tabIndex={0}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 transition w-full"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
          </div>
          {/* Date Range: From */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="date-from"
            >
              From
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaCalendarAlt
                  className="text-gray-400"
                  size={16}
                  aria-hidden="true"
                />
              </span>
              <DatePicker
                id="date-from"
                selected={startDate}
                onChange={(date) => setDateRange([date, endDate])}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="From"
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full text-sm"
                aria-label="From date"
                tabIndex={0}
                isClearable
              />
            </div>
          </div>
          {/* Date Range: To */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="date-to"
            >
              To
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaCalendarAlt
                  className="text-gray-400"
                  size={16}
                  aria-hidden="true"
                />
              </span>
              <DatePicker
                id="date-to"
                selected={endDate}
                onChange={(date) => setDateRange([startDate, date])}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || undefined}
                placeholderText="To"
                className="pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full text-sm"
                aria-label="To date"
                tabIndex={0}
                isClearable
              />
            </div>
          </div>
          {/* Owner Dropdown */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="owner-filter"
            >
              Owner
            </label>
            <select
              id="owner-filter"
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              aria-label="Filter by owner"
              tabIndex={0}
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 transition w-full"
            >
              <option value="anyone">Owned by anyone</option>
              <option value="me">Owned by me</option>
            </select>
          </div>
        </div>
        <hr className="my-6 border-gray-200" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <span className="text-gray-500 text-sm">Showing 8 of 8 leads</span>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              tabIndex={0}
              aria-label="Clear filters"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateRange([null, null]);
                setOwnerFilter("anyone");
              }}
            >
              Clear Filters
            </button>
            <button
              className="px-4 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-black/60 transition"
              tabIndex={0}
              aria-label="Apply filters"
              onClick={handleSearch}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      {/* Table Card (with Add New button in header) */}
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
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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
              if (colKey === "owner") {
                if (row.owner === "me") {
                  return (
                    <span className="group relative flex items-center justify-center">
                      <FaUser className="text-green-500 w-5 h-5" />
                      <span
                        className="absolute left-1/2 -translate-x-1/2 top-8 z-10 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                        style={{ minWidth: 120 }}
                      >
                        You own this lead
                      </span>
                    </span>
                  );
                } else if (row.owner === "shared") {
                  return (
                    <span className="group relative flex items-center justify-center">
                      <FiShare2 className="text-blue-500 w-5 h-5" />
                      <span
                        className="absolute left-1/2 -translate-x-1/2 top-8 z-10 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"
                        style={{ minWidth: 120 }}
                      >
                        Shared by {row.sharedBy}
                      </span>
                    </span>
                  );
                }
                return null;
              }
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
