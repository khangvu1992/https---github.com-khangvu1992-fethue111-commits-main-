'use client';

import {
  ColumnDef,
  PaginationState,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { flexRender } from '@tanstack/react-table';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import axios from 'axios';

export default function MyTable({ columns }: { columns: ColumnDef<any>[] }) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Call API with TanStack Query
  const { data, isFetching } = useQuery({
    queryKey: ['table-data', pagination.pageIndex, pagination.pageSize],
    queryFn: async () => {
      const res = await axios.get('http://localhost:8080/api/excel_search', {
        params: {
          page: pagination.pageIndex,
          size: pagination.pageSize,
        },
      });
      return res.data; // assumed { content: [], totalPages, totalElements }
    },
    // keepPreviousData: true,
  });

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
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
  });

  return (
    <div className="p-4">
      <table className="border w-full">
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} className="border p-2 text-left">
                  {header.isPlaceholder
                    ? null
                    : header.column.getCanSort()
                    ? (
                        <div
                          className="cursor-pointer"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {header.column.columnDef.header as string}
                          {header.column.getIsSorted() === 'asc' ? ' 🔼' : header.column.getIsSorted() === 'desc' ? ' 🔽' : ''}
                        </div>
                      )
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} className="border p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center gap-2 mt-4">
        <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
          {'<<'}
        </button>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          {'<'}
        </button>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          {'>'}
        </button>
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
          {'>>'}
        </button>

        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of {data?.totalPages}
          </strong>
        </span>

        <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border rounded w-16 p-1"
          />
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
        >
          {[10, 20, 30, 50, 100].map(size => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>

        {isFetching && <span className="ml-2 text-sm">Loading...</span>}
      </div>
    </div>
  );
}
