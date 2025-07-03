import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useState } from "react";

// Fake data type
type Lead = {
  id: number;
  name?: string;
  email: string;
  phone?: string;
  source?: string;
  status: "new" | "contacted" | "converted" | "lost";
  createdAt: string;
};

const fakeLeads: Lead[] = [
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

const statusStyles: Record<Lead["status"], string> = {
  new: "bg-blue-100 text-blue-600",
  contacted: "bg-yellow-100 text-yellow-600",
  converted: "bg-green-100 text-green-600",
  lost: "bg-red-100 text-red-600",
};

const LeadTable = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Pagination logic (UI only)
  const totalRows = 1240; // Example total
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleView = (id: number) => {
    alert(`View lead ${id}`);
  };

  const handleEdit = (id: number) => {
    alert(`Modify lead ${id}`);
  };

  const handleDelete = (id: number) => {
    alert(`Delete lead ${id}`);
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
        <table className="min-w-full text-sm bg-white rounded-xl">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {fakeLeads.map((lead) => (
              <tr
                key={lead.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-semibold text-gray-800 text-base whitespace-nowrap">
                  {lead.name || <span className="text-gray-400 italic">—</span>}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {lead.email}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {lead.phone || (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {lead.source || (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      statusStyles[lead.status]
                    }`}
                  >
                    {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {lead.createdAt}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleView(lead.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleView(lead.id);
                      }}
                      tabIndex={0}
                      aria-label={`View lead ${lead.email}`}
                      title="View"
                      className="group p-2 rounded-full bg-gray-100 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    >
                      <FaEye
                        className="text-blue-500 group-hover:text-blue-600"
                        size={18}
                      />
                    </button>
                    <button
                      onClick={() => handleEdit(lead.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleEdit(lead.id);
                      }}
                      tabIndex={0}
                      aria-label={`Modify lead ${lead.email}`}
                      title="Modify"
                      className="group p-2 rounded-full bg-gray-100 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    >
                      <FaEdit
                        className="text-yellow-500 group-hover:text-yellow-600"
                        size={18}
                      />
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleDelete(lead.id);
                      }}
                      tabIndex={0}
                      aria-label={`Delete lead ${lead.email}`}
                      title="Delete"
                      className="group p-2 rounded-full bg-gray-100 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 transition"
                    >
                      <FaTrash
                        className="text-red-500 group-hover:text-red-600"
                        size={18}
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3 bg-gray-50 rounded-xl px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">Rows per page:</span>
          <select
            className="border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            aria-label="Rows per page"
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">{`${
            (page - 1) * rowsPerPage + 1
          }-${Math.min(page * rowsPerPage, totalRows)} of ${totalRows}`}</span>
          <button
            onClick={handlePrevPage}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handlePrevPage();
            }}
            tabIndex={0}
            aria-label="Previous page"
            className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition"
            disabled={page === 1}
          >
            &#60;
          </button>
          <button
            onClick={handleNextPage}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleNextPage();
            }}
            tabIndex={0}
            aria-label="Next page"
            className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition"
            disabled={page === totalPages}
          >
            &#62;
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadTable;
