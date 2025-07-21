"use client";
import { useEffect, useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import BaseTable, { BaseTableColumn } from "@/components/ui/tables/BaseTable";
import Link from "next/link";
import { usePageContext } from "@/context/PageTitleContext";

// Mock data for API keys
const fakeApiKeys = [
  {
    id: 1,
    clientName: "Acme Corp",
    email: "admin@acme.com",
    totalApiKeys: 5,
    activeKeys: 3,
    revokedKeys: 2,
    totalUsageCount: 1200,
  },
  {
    id: 2,
    clientName: "Beta LLC",
    email: "contact@beta.com",
    totalApiKeys: 2,
    activeKeys: 2,
    revokedKeys: 0,
    totalUsageCount: 450,
  },
  {
    id: 3,
    clientName: "Gamma Inc",
    email: "info@gamma.com",
    totalApiKeys: 4,
    activeKeys: 1,
    revokedKeys: 3,
    totalUsageCount: 300,
  },
  {
    id: 4,
    clientName: "Delta Ltd",
    email: "support@delta.com",
    totalApiKeys: 3,
    activeKeys: 3,
    revokedKeys: 0,
    totalUsageCount: 980,
  },
];

const rowsPerPageOptions = [8, 16, 32];

const columns: BaseTableColumn[] = [
  { key: "clientName", label: "Client Name" },
  { key: "email", label: "Email" },
  { key: "totalApiKeys", label: "Total API Keys" },
  { key: "activeKeys", label: "Active Keys" },
  { key: "revokedKeys", label: "Revoked Keys" },
  { key: "totalUsageCount", label: "Total Usage Count" },
  {
    key: "actions",
    label: "Actions",
    className:
      "px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider",
  },
];

const ApiKeysPage = () => {
  const { setLabel, setTitle } = usePageContext();

  useEffect(() => {
    setLabel("Api Keys");
    setTitle("Api Keys");
  }, [setLabel, setTitle]);

  // Filter state (no filtering logic, just state)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [usageCountMin, setUsageCountMin] = useState("");
  const [usageCountMax, setUsageCountMax] = useState("");
  const [totalKeysMin, setTotalKeysMin] = useState("");
  const [totalKeysMax, setTotalKeysMax] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const totalRows = fakeApiKeys.length;

  // Handlers (no filtering logic)
  const handleSearch = () => {
    setPage(1);
  };

  const handleSearchInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setUsageCountMin("");
    setUsageCountMax("");
    setTotalKeysMin("");
    setTotalKeysMax("");
    setPage(1);
  };

  // Pagination logic (on full data)
  const paginatedData = fakeApiKeys.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="w-full space-y-6">
      {/* Filter Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <FiFilter className="text-gray-700" size={24} />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
              Filters
            </h2>
          </div>
          <p className="text-gray-500 text-sm">
            Filter API keys by various criteria
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Search Bar */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="api-key-search"
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
                id="api-key-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearchInputKeyDown}
                placeholder="Search client or email..."
                aria-label="Search API keys"
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
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 transition w-full"
            >
              <option value="all">All</option>
              <option value="active">Only Active Keys</option>
              <option value="revoked">Only Revoked Keys</option>
            </select>
          </div>
          {/* Total Usage Count Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Usage Count
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={usageCountMin}
                onChange={(e) => setUsageCountMin(e.target.value)}
                placeholder="Min"
                aria-label="Min usage count"
                tabIndex={0}
                className="w-1/2 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
              <input
                type="number"
                min={0}
                value={usageCountMax}
                onChange={(e) => setUsageCountMax(e.target.value)}
                placeholder="Max"
                aria-label="Max usage count"
                tabIndex={0}
                className="w-1/2 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
            </div>
          </div>
          {/* Total Keys Number Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Keys Number
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={0}
                value={totalKeysMin}
                onChange={(e) => setTotalKeysMin(e.target.value)}
                placeholder="Min"
                aria-label="Min total keys"
                tabIndex={0}
                className="w-1/2 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
              <input
                type="number"
                min={0}
                value={totalKeysMax}
                onChange={(e) => setTotalKeysMax(e.target.value)}
                placeholder="Max"
                aria-label="Max total keys"
                tabIndex={0}
                className="w-1/2 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
              />
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200" />
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <span className="text-gray-500 text-sm">
            Showing {paginatedData.length} of {fakeApiKeys.length} API keys
          </span>
          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button
              className="px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              tabIndex={0}
              aria-label="Clear filters"
              onClick={handleClearFilters}
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
      {/* Table */}
      <div className="w-full bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full mb-6 gap-3">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Client’s API Keys
          </h2>
        </div>
        <div className="overflow-x-auto">
          <BaseTable
            columns={columns}
            data={paginatedData}
            rowKey={(row) => row.id}
            renderCell={(row, colKey) => {
              if (colKey === "actions") {
                return (
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/api-keys/view/${row.id}`} passHref>
                      <button
                        tabIndex={0}
                        aria-label={`View API keys for ${row.email}`}
                        title="View"
                        className="group p-2 rounded-full bg-gray-100 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      >
                        <FaEye
                          className="text-blue-500 group-hover:text-blue-600"
                          size={18}
                        />
                      </button>
                    </Link>
                  </div>
                );
              }
              // @ts-ignore
              return row[colKey];
            }}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRows={fakeApiKeys.length}
            onPageChange={setPage}
            onRowsPerPageChange={setRowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default ApiKeysPage;
