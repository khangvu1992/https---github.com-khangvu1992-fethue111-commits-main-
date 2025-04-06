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
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { debounce } from 'lodash';


// Hàm gọi API, thêm các tham số phân trang và bộ lọc vào truy vấn
const fetchData = async (
  pageIndex: number,
  pageSize: number,
  filters: Array<{ columnId: string; value: any }>
) => {
  const filterParams = filters.reduce<Record<string, any>>((acc, filter) => {
    acc[filter.columnId] = filter.value; // Thêm filter vào tham số API
    return acc;
  }, {});

  const res = await axios.post(
    "http://localhost:8080/api/excel_search", // URL
    filterParams, // Body (filters sẽ được gửi trong body của POST request)
    {
      params: {  // Query params (page, size)
        page: pageIndex,
        size: pageSize
      }
    }
  );

  return res.data; // Giả định là { content: [], totalPages, totalElements }
};

export default function MyTable({ columns }: { columns: ColumnDef<any>[] }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filters, setFilters] = useState<
    Array<{ columnId: string; value: any }>
  >([]);

  const { data, isFetching, refetch } = useQuery({
    queryKey: [
      "table-data",
      pagination.pageIndex,
      pagination.pageSize,
      filters,
    ], // Thêm bộ lọc vào queryKey để tái tải lại khi bộ lọc thay đổi
    queryFn: () =>
      fetchData(pagination.pageIndex, pagination.pageSize, filters),
    staleTime: 1000, // Dữ liệu sẽ vẫn được coi là mới trong 5 giây
  });

  // Handle filter change and trigger the API call
  const handleFilterChange = (value: string, columnId: string) => {
    table.getColumn(columnId)?.setFilterValue(value);

    // Update filter state
    setFilters((oldFilters) => {
      const newFilters = [...oldFilters];
      const index = newFilters.findIndex(
        (filter) => filter.columnId === columnId
      );

      if (index >= 0) {
        newFilters[index].value = value; // Update filter value
      } else {
        newFilters.push({ columnId, value }); // Add new filter
      }
      console.log("filters", filters);
      console.log("newFilters", newFilters);

      return newFilters;
    });
  };

  const table = useReactTable({
    data: data?.content ?? [],
    columns,
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
      <table className="border w-full">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  <div
                    className={
                      header.column.getCanSort()
                        ? "cursor-pointer select-none"
                        : ""
                    }
                    // onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    {header.column.getCanFilter() && (
                      <div>
                        <input
                          type="text"
                          value={
                            (header.column.getFilterValue() as string) ?? ""
                          }
                          onChange={(e) => {
                            handleFilterChange(e.target.value, header.id); // Call the handler
                          }}
                          placeholder="Search..."
                        />
                      </div>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </table>

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
    <div className="flex flex-wrap items-center gap-3 mt-4">
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
          defaultValue={table.getState().pagination.pageIndex + 1}
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
          {[10, 20, 30, 50, 100].map((size) => (
            <SelectItem key={size} value={String(size)}>
              {`Hiển thị ${size}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  
      {isFetching && <span className="ml-2 text-sm text-muted-foreground">Đang tải...</span>}
    </div>
  );
}
