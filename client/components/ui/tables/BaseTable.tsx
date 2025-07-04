import React from "react";

export type BaseTableColumn = {
  key: string;
  label: string;
  className?: string;
};

export type BaseTableProps<T> = {
  columns: BaseTableColumn[];
  data: T[];
  rowKey: (row: T) => string | number;
  renderCell?: (row: T, colKey: string) => React.ReactNode;
  className?: string;
  // Pagination props
  page: number;
  rowsPerPage: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  rowsPerPageOptions?: number[];
};

function BaseTable<T>({
  columns,
  data,
  rowKey,
  renderCell,
  className = "min-w-full text-sm bg-white rounded-xl",
  page,
  rowsPerPage,
  totalRows,
  onPageChange,
  onRowsPerPageChange,
  rowsPerPageOptions = [8, 16, 32],
}: BaseTableProps<T>) {
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const handlePrevPage = () => {
    if (page > 1) onPageChange(page - 1);
  };
  const handleNextPage = () => {
    if (page < totalPages) onPageChange(page + 1);
  };
  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onRowsPerPageChange(Number(e.target.value));
    onPageChange(1);
  };

  return (
    <>
      <table className={className}>
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={
                  col.className ||
                  "px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider"
                }
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={rowKey(row)}
              className="border-b border-gray-100 hover:bg-gray-50 transition"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                  {renderCell
                    ? renderCell(row, col.key)
                    : // @ts-ignore
                      row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
            tabIndex={0}
            aria-label="Previous page"
            className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition"
            disabled={page === 1}
          >
            &#60;
          </button>
          <button
            onClick={handleNextPage}
            tabIndex={0}
            aria-label="Next page"
            className="px-3 py-1 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 disabled:opacity-50 transition"
            disabled={page === totalPages}
          >
            &#62;
          </button>
        </div>
      </div>
    </>
  );
}

export default BaseTable;
