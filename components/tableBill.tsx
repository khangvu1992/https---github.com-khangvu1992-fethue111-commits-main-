"use client";

import {
  ColumnDef,
  PaginationState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  Table,
  Column,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { debounce } from "lodash";
import clsx from "clsx";

// Hàm gọi API, thêm các tham số phân trang và bộ lọc vào truy vấn

export default function MyTableBill({
 data,
 columns,
}: {
  data: any,columns: any;
}) {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });









  const table = useReactTable({
    data: data?.data ?? [],
    columns: [
      {
        id: "stt",
        header: "STT",
        cell: ({ row }) =>
          pagination.pageIndex * pagination.pageSize + row.index + 1,
      },
      ...columns, // các cột khác do bạn truyền vào
    ],
    pageCount: data?.totalPages ?? -1,
    state: {
      pagination,
    },
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <div className="max-h-[600px]  max-w-9/10  overflow-x-auto overflow-y-auto  scrollbar-thick">
        <table className="border w-full min-w-[800px] ">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
              
                    className="border p-2 font-bold sticky top-0 z-10 " 
                  >
                    <div
                      className={
                        header.column.getCanSort()
                          ? "cursor-pointer select-none"
                          : ""
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="even:bg-gray-100 cursor-pointer"
                data-state={selectedRowId === row.id ? "selected" : undefined}
                onClick={() =>
                  setSelectedRowId((prev) => (prev === row.id ? null : row.id))
                }
              >
                {row.getVisibleCells().map((cell, colIndex) => (
                  <TableCell key={cell.id}  className={clsx(
              "border p-2 whitespace-nowrap text-sm",
              // colIndex === 0 && 'sticky left-0 bg-yellow-100 z-10 shadow',
            // giả sử cột đầu tiên là 150px
            )}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>

    </div>
  );
}


