import React from "react";

type Column = {
  key: string;      // Tên trường dữ liệu (object key)
  label: string;    // Tên hiển thị ở header
};

type Props = {
  columns: Column[];
  data: Record<string, any>[]; // Mỗi dòng là object bất kỳ
  title?: string;
};

const DynamicTable: React.FC<Props> = ({ columns, data, title = "Bảng dữ liệu" }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="border px-4 py-2">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="border px-4 py-2">{row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
