

'use client'
import {
  Column,
  ColumnDef,
  PaginationState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Person } from '@/makeData'
import React from 'react'
import { TableBody, TableCell, TableHeader, TableRow } from './ui/table'



export default  function MyTable({
    data,
    columns,
  }: {
    data: Person[]
    columns: ColumnDef<Person>[]
  }) {
    const [pagination, setPagination] = React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })
  
    const table = useReactTable({
      columns,
      data,
      debugTable: true,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
      state: {
        pagination,
      },
      // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
    })
    return (
        <div className="p-2">
          <div className="h-2" />
          <table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <th key={header.id} colSpan={header.colSpan}>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' 🔼',
                            desc: ' 🔽',
                          }[header.column.getIsSorted() as string] ?? null}
                          {header.column.getCanFilter() ? (
                            <div>
                              <Filter column={header.column} table={table} />
                            </div>
                          ) : null}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                )
              })}
            </TableBody>
          </table>
          <div className="h-2" />
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {'<'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>'}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {'>>'}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{' '}
                {table.getPageCount().toLocaleString()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div>
            Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
            {table.getRowCount().toLocaleString()} Rows
          </div>
          <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>



{/* 
          <Table>
  <TableCaption>A list of your recent invoices.</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table> */}
        </div>
      )
    }
    

    function Filter({
        column,
        table,
      }: {
        column: Column<any, any>
        table: Table<any>
      }) {
        const firstValue = table
          .getPreFilteredRowModel()
          .flatRows[0]?.getValue(column.id)
      
        const columnFilterValue = column.getFilterValue()
      
        return typeof firstValue === 'number' ? (
          <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
            <input
              type="number"
              value={(columnFilterValue as [number, number])?.[0] ?? ''}
              onChange={e =>
                column.setFilterValue((old: [number, number]) => [
                  e.target.value,
                  old?.[1],
                ])
              }
              placeholder={`Min`}
              className="w-24 border shadow rounded"
            />
            <input
              type="number"
              value={(columnFilterValue as [number, number])?.[1] ?? ''}
              onChange={e =>
                column.setFilterValue((old: [number, number]) => [
                  old?.[0],
                  e.target.value,
                ])
              }
              placeholder={`Max`}
              className="w-24 border shadow rounded"
            />
          </div>
        ) : (
          <input
            className="w-36 border shadow rounded"
            onChange={e => column.setFilterValue(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
          />
        )



      }