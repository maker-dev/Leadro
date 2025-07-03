import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";

// Fake data type
type Client = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
};

const fakeClients: Client[] = [
  {
    id: 1,
    username: "Acuity Infotech FZCO",
    email: "info@acuity.ae",
    createdAt: "2023-01-01",
  },
  {
    id: 2,
    username: "ABC Infotech",
    email: "info@abcinfotech.com",
    createdAt: "2023-01-02",
  },
  {
    id: 3,
    username: "NEW Infotech",
    email: "info@newinfotech.in",
    createdAt: "2023-01-03",
  },
  {
    id: 4,
    username: "ABC Infotech 2",
    email: "info2@acuity.ae",
    createdAt: "2023-01-04",
  },
  {
    id: 5,
    username: "ABC Infotech 3",
    email: "info3@acuity.ae",
    createdAt: "2023-01-05",
  },
  {
    id: 6,
    username: "ABC Infotech 4",
    email: "info4@acuity.ae",
    createdAt: "2023-01-06",
  },
  {
    id: 7,
    username: "ABC Infotech 5",
    email: "info5@acuity.ae",
    createdAt: "2023-01-07",
  },
  {
    id: 8,
    username: "ABC Infotech 6",
    email: "info6@acuity.ae",
    createdAt: "2023-01-08",
  },
];

const rowsPerPageOptions = [8, 16, 32];

const ClientTable = () => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  // Pagination logic (UI only)
  const totalRows = 1240; // Example total
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const handleEdit = (id: number) => {
    // Placeholder for edit action
    alert(`Edit client ${id}`);
  };

  const handleDelete = (id: number) => {
    // Placeholder for delete action
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
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">All Clients</h2>
        <button
          className="bg-green-500 text-white px-5 py-2 rounded-full shadow hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 transition cursor-pointer"
          tabIndex={0}
          aria-label="Add New Client"
        >
          Add New
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm bg-white rounded-xl">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Email
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
            {fakeClients.map((client) => (
              <tr
                key={client.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-4 font-semibold text-gray-800 text-base whitespace-nowrap">
                  {client.username}
                </td>
                <td className="px-6 py-4 text-gray-600 whitespace-nowrap">
                  {client.email}
                </td>
                <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                  {client.createdAt}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(client.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleEdit(client.id);
                      }}
                      tabIndex={0}
                      aria-label={`Edit ${client.username}`}
                      title="Edit"
                      className="group p-2 rounded-full bg-gray-100 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                    >
                      <FaEdit
                        className="text-yellow-500 group-hover:text-yellow-600"
                        size={18}
                      />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleDelete(client.id);
                      }}
                      tabIndex={0}
                      aria-label={`Delete ${client.username}`}
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

export default ClientTable;
