

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
import React, { useEffect } from 'react'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { useDispatch } from 'react-redux';
import { setDataFromChild } from '@/src/store/dataslice'
import axios from 'axios'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';



export default  function MyTable( {
    // data,
    columns,
  }: {
    // data: any[]
    columns: ColumnDef<any>[]
  }) {

    const [data, setData] = React.useState([]);
    const [totalPages, setTotalPages] = React.useState(0);

    const dispatch = useDispatch();

    const [pagination, setPagination] = React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })


    const fetchData = async (pageIndex: number, pageSize: number) => {
      try {
        const response = await axios.get('http://localhost:8080/api/excel_search', {
          params: {
            page: pageIndex,
            size: pageSize,
          },
        });
  
        const { content, totalPages, totalElements } = response.data;
        setData(content); 
        setTotalPages(totalPages); 
        // dispatch(setDataFromChild(content));
  
        setPagination(prev => ({
          ...prev,
          pageIndex,
          pageSize,
          pageCount: totalPages,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };


    useEffect(() => {
   
      // Function to fetch data from the backend with pagination

  
      fetchData(0,10);
    }, []);



    const handleSetPage = (updater: PaginationState | ((prev: PaginationState) => PaginationState)) => {
      if (typeof updater === 'function') {
        const newPagination = updater(pagination);
        setPagination(newPagination);
        // fetchData(newPagination.pageIndex, newPagination.pageSize);
      } else {
        setPagination(updater);
        // fetchData(updater.pageIndex, updater.pageSize);
      }
    };
    
 


    const table = useReactTable({
      columns,
      data,
      debugTable: true,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: handleSetPage,
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
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead className='size-min'  key={header.id} colSpan={header.colSpan}>
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
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      return (
                        <TableCell className='size-min' key={cell.id}>
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
              2222222
              <strong>
                {table.getState().pagination.pageIndex + 1} of{totalPages}
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
              />ttttttttttttttt
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50,100].map(pageSize => (
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
      
        return typeof firstValue === null ? (
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
            className="w-20 border shadow rounded"
            onChange={e => column.setFilterValue(e.target.value)}
            onClick={e => e.stopPropagation()}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
          />
        )



      }