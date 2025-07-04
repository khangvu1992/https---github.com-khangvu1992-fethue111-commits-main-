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

// Hàm gọi API, thêm các tham số phân trang và bộ lọc vào truy vấn

export default function MyTableBill({
  columns,
}: {
  columns: ColumnDef<any>[];
}) {
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  interface ApiResponse {
    content: any[];
    totalPages: number;
    totalElements: number;
  }
  const [data, setData] = useState<ApiResponse | null>(null);

  const [filters, setFilters] = useState<
    Array<{ columnId: string; value: any }>
  >([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchData = async (
    pageIndex: number,
    pageSize: number,
    filters: Array<{ columnId: string; value: any }>
  ) => {
    setIsFetching(true);

    const filterParams = filters.reduce<Record<string, any>>((acc, filter) => {
      acc[filter.columnId] = filter.value; // Thêm filter vào tham số API
      return acc;
    }, {});

    const res = await axios.post(
      "http://localhost:8080/api/excel_search", // URL
      filterParams, // Body (filters sẽ được gửi trong body của POST request)
      {
        params: {
          // Query params (page, size)
          page: pageIndex,
          size: pageSize,
        },
      }
    );

    setData(res.data);

    setIsFetching(false);

    return res.data; // Giả định là { content: [], totalPages, totalElements }
  };

  // Debounce fetchData
  const debouncedFetchData = debounce(fetchData, 1300);

  useEffect(() => {
    debouncedFetchData(pagination.pageIndex, pagination.pageSize, filters);

    // Cleanup debounce on unmount
    return () => {
      debouncedFetchData.cancel();
    };
  }, [pagination.pageIndex, pagination.pageSize, filters]);

  // Handle filter change and trigger the API call

  const table = useReactTable({
    data: data?.content ?? [],
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
      <div className="w-full overflow-x-auto scrollbar-thick">
        <table className="border w-full min-w-[800px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className="border p-2 font-bold"
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
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="border p-2 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>

      <PaginationControls table={table} data={data} isFetching={isFetching} />
    </div>
  );
}

// Pagination controls component
function PaginationControls({
  table,
  data,
  isFetching,
}: {
  table: Table<any>;
  data: any;
  isFetching: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 mt-1">
      <Button
        variant="outline"
        size="icon"
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
      >
        {"<<"}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        {"<"}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        {">"}
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        {">>"}
      </Button>

      <span className="text-sm">
        Trang{" "}
        <strong>
          {table.getState().pagination.pageIndex + 1} / {data?.totalPages}
        </strong>
      </span>

      <div className="flex items-center gap-2">
        <span className="text-sm">| Đến trang:</span>
        <Input
          type="number"
          min={1}
          max={data?.totalPages}
          className="w-20"
          value={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
        />
      </div>

      <Select
        value={String(table.getState().pagination.pageSize)}
        onValueChange={(value) => table.setPageSize(Number(value))}
      >
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Số dòng / trang" />
        </SelectTrigger>
        <SelectContent>
          {[10, 20, 30, 50, 100, 500].map((size) => (
            <SelectItem key={size} value={String(size)}>
              {`Hiển thị ${size}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isFetching && (
        <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>
      )}
      {!isFetching && (
        <span className="ml-2 text-sm text-muted-foreground">
          {data?.totalElements}
        </span>
      )}
    </div>
  );
}
