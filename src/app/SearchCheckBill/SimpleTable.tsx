import React from "react";

type Column = {
  accessorKey: string;
  header: string;
};

type Props = {
  columns: Column[];
  data: Record<string, any>[];
  title?: string;
};

const DynamicTable: React.FC<Props> = ({ columns, data, title = "Bảng dữ liệu" }) => {
  const visibleColumns = columns.filter((col) => col.accessorKey !== "id");

  const formatValue = (value: any) => {
    if (typeof value === "number") {
      return value.toLocaleString("en-US", { maximumFractionDigits: 3 });
    }
    return String(value ?? "");
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="table-auto border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center whitespace-nowrap">STT</th>
            {visibleColumns.map((col) => (
              <th
                key={col.accessorKey}
                className="border px-4 py-2 text-left whitespace-nowrap"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((row, index) => (
              <tr key={`${index}-${Math.random()}`} className="hover:bg-gray-50">
                <td className="border px-4 py-2 text-center">{index + 1}</td>
                {visibleColumns.map((col) => (
                  <td
                    key={col.accessorKey}
                    className="border px-4 py-2 whitespace-nowrap"
                  >
                    {formatValue(row[col.accessorKey])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={visibleColumns.length + 1} className="text-center py-4">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
