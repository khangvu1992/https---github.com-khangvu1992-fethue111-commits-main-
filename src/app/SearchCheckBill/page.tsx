"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import MyTableBill from "@/components/tableBill";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Key, useEffect, useState } from "react";
import axios from "axios";
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { generateColumnsFromMeta } from "@/src/util/generateColumnsFromMeta";
import { isEqual } from "lodash";
import Header from "@/components/header";

export default function dashboard({ onSend }: { onSend: (data: any) => void }) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedFieldsView, setSelectedFieldsView] = useState<string[]>([]);
  const [selectedFieldsOrder, setSelectedFieldsOrder] = useState<string[]>([]);

  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [data, setData] = useState<any | null>(null);

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

  const fetchDataReal = async (
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
        params: {
          // Query params (page, size)
          page: pageIndex,
          size: pageSize,
        },
      }
    );

    setData(res.data);

    return res.data; // Giả định là { content: [], totalPages, totalElements }
  };

  useEffect(() => {
    fetchData();
    fetchDataReal(0, 10, []);
  }, []);

  const fetchData = async () => {
    try {
      // Replace with your API endpoint
      const response = await axios.get("http://localhost:8080/api/bill_search");
      setOptionTable(response.data);

      // If the request is successful, set the files in the state
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const fetchData2 = async (name: string) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/bill_search/nameColumns",
        {
          params: {
            tableName: name,
          },
        }
      );

      const newMeta = response.data;
      // So sánh trực tiếp nameColumns gốc (metadata)
      setNameColumnsOrder(newMeta);
      const newMetaWithAll = [{ columnName: "all" }, ...newMeta];

      // Nếu metadata không thay đổi thì không làm gì
      const isSame = isEqual(nameColumns, newMetaWithAll);
      if (isSame) return;
      // ✅ Reset toàn bộ form sau submit

      // Nếu khác thì set lại tất cả
      setNameColumns(newMetaWithAll);
      setSelectedFields([]);
      setSelectedFieldsView([]);
      setSelectedFieldsOrder([]);

      const generated = generateColumnsFromMeta(newMeta);
      setColumns(generated);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  type OptionTableItem = {
    dataType: string;
    columnName: Key | null | undefined;
    tableName: string;
  };
  const [optionTable, setOptionTable] = useState<OptionTableItem[]>([]);
  const [nameColumns, setNameColumns] = useState<OptionTableItem[]>([]);
  const [nameColumnsOrder, setNameColumnsOrder] = useState<OptionTableItem[]>(
    []
  );

  const typeOptionsTable = [
    { label: "Nhập khẩu", value: "nhapKhau" },
    { label: "Xuất khẩu", value: "xuatKhau" },
    { label: "SeawayMasterBill", value: "SeawayMasterBill" },
    { label: "SeawayHouseBill", value: "SeawayHouseBill" },
    { label: "AirMasterBill", value: "AirMasterBill" },
    { label: "AirHouseBill", value: "AirHouseBill" },
    { label: "Vận Đơn", value: "VanDon" },
  ];

  const FormSchema = z
    .object({
      // username: z.string(),
      // dateDK: z.string(),
      // mahq: z.string(),
      // hsCode: z.string(),
      // numKQ: z.string().nonempty("This is required"),
      nameTable: z.string(),
      typeTable: z.string(),
      // orderBy: z.string(),
      // typeTableSearch: z.string().optional(),
    })
    .catchall(z.string().optional());

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // username: "",
      // dateDK: "",
      // mahq: "",
      // hsCode: "",
      // numKQ: "1000",
      // typeTable: "",
      // typeTableSearch: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("Submitted data:", data);
    try {
      const fieldNames = selectedFields.map((field) => field.split("**")[0]);
      console.log("Selected fields:", fieldNames);
      console.log("Selected fields view:", data);

      const filtered = mapFiltered(fieldNames, data);

      let payload2 = {
        nameTable: data.nameTable,
        // numRows: data.numKQ,
        pagination: pagination,
        selectedFields: selectedFieldsView,
        filtered: filtered,
        order: selectedFieldsOrder,
      };
      console.log(payload2);

      const response = await axios.post(
        "http://localhost:8080/api/bill_search//find",
        payload2
      );

      // Gửi dữ liệu kết quả sang bảng
      onSend(response.data); // hoặc setData nếu bạn giữ state ở đây

      toast.success("Tìm kiếm thành công!");
    } catch (err) {
      console.error("Error during search:", err);
      toast.error("Lỗi khi tìm kiếm");
    }
  }

  useEffect(() => {
    if (nameColumnsOrder.length > 0 && selectedFieldsOrder.length === 0) {
      const firstColumn = nameColumnsOrder[0].columnName;
      if (firstColumn) {
        setSelectedFieldsOrder([String(firstColumn)]);
      }
    }
  }, [nameColumnsOrder]);

  return (
    <>
      <Header title="Tìm kiếm"></Header>

      <br />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <div className="flex flex-wrap gap-6 ml-5">
            <FormField
              control={form.control}
              name="nameTable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Table database</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value); // Cập nhật form state nếu dùng react-hook-form
                        fetchData2(value); // Gọi API để lấy danh sách column
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn table" />
                      </SelectTrigger>
                      <SelectContent>
                        {optionTable.map((opt) => (
                          <SelectItem value={opt.tableName}>
                            {opt.tableName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeTable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại bảng</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại bảng" />
                      </SelectTrigger>
                      <SelectContent>
                        {typeOptionsTable.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel>Thêm trường tìm kiếm</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {selectedFields.length > 0
                        ? selectedFields.join(", ")
                        : "Chọn trường nhanh"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] max-h-[300px] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {nameColumns.map((opt) => {
                        const column = opt || ""; // ép an toàn về string

                        return (
                          <label
                            key={column.columnName}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={String(
                                column.columnName + "**" + column.dataType || ""
                              )}
                              checked={selectedFields.includes(
                                String(
                                  column.columnName + "**" + column.dataType ||
                                    ""
                                )
                              )}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSelectedFields((prev) =>
                                  prev.includes(value)
                                    ? prev.filter((v) => v !== value)
                                    : [...prev, value]
                                );
                              }}
                            />
                            <span>{String(column.columnName || "")}</span>
                          </label>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Trường Hiển thị</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {selectedFieldsView.length > 0
                        ? selectedFieldsView.join(", ")
                        : "Chọn trường nhanh"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] max-h-[300px] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {nameColumns.map((opt) => {
                        const column = opt; // ép an toàn về string
                        return (
                          <>
                            <label
                              key={column.columnName}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                value={String(column.columnName) || ""}
                                checked={selectedFieldsView.includes(
                                  String(column.columnName || "")
                                )}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSelectedFieldsView((prev) =>
                                    prev.includes(value)
                                      ? prev.filter((v) => v !== value)
                                      : [...prev, value]
                                  );
                                }}
                              />
                              <span>{column.columnName}</span>
                            </label>
                          </>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>

            <FormItem>
              <FormLabel>Sắp xếp</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {selectedFieldsOrder.length > 0
                        ? selectedFieldsOrder.join(", ")
                        : "Chọn trường nhanh"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] max-h-[300px] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {nameColumnsOrder.map((opt) => {
                        const column = opt; // ép an toàn về string
                        return (
                          <>
                            <label
                              key={column.columnName}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                value={String(column.columnName) || ""}
                                checked={selectedFieldsOrder.includes(
                                  String(column.columnName || "")
                                )}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setSelectedFieldsOrder((prev) =>
                                    prev.includes(value)
                                      ? prev.filter((v) => v !== value)
                                      : [...prev, value]
                                  );
                                }}

                                // onChange={(e) => {
                                //   const value = e.target.value;

                                //   // Nếu click chọn -> chỉ chọn giá trị đó, bỏ các cái khác
                                //   // Nếu click bỏ chọn -> set về []
                                //   setSelectedFieldsOrder((prev) =>
                                //     prev.includes(value) ? [] : [value]
                                //   );
                                // }}
                              />
                              <span>{column.columnName}</span>
                            </label>
                          </>
                        );
                      })}
                    </div>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* <FormField
              control={form.control}
              name="numKQ"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới hạn tìm kiếm</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Gioi han so luong tim kiem"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            /> */}
          </div>
          <div className="flex flex-wrap gap-6 ml-5">
            {selectedFields.map((field) => {
              const [fieldName, rawType] = field.split("**");
              const dataType = rawType?.toLowerCase() || "";

              const isDateType =
                dataType.includes("date") || dataType.includes("time");

              const isNumberType =
                dataType.includes("int") ||
                dataType.includes("decimal") ||
                dataType.includes("float") ||
                dataType.includes("double");

              const inputType = isDateType
                ? "date"
                : isNumberType
                ? "number"
                : "text";

              if (isDateType || isNumberType) {
                return (
                  <React.Fragment key={fieldName}>
                    <FormField
                      control={form.control}
                      name={`${fieldName}_from`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldName} từ</FormLabel>
                          <FormControl>
                            <Input
                              type={inputType}
                              {...field}
                              placeholder={`Từ ${fieldName}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`${fieldName}_to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldName} đến</FormLabel>
                          <FormControl>
                            <Input
                              type={inputType}
                              {...field}
                              placeholder={`Đến ${fieldName}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </React.Fragment>
                );
              }

              // Trường kiểu khác (text, nvarchar,...)
              return (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{fieldName}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          placeholder={`Nhập ${fieldName}`}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>

          {/* <div className="flex flex-wrap gap-6 ml-5">
            {selectedFields.map((field) => {
              const [fieldName, rawType] = field.split("**");
              const dataType = rawType?.toLowerCase() || "";
              let inputType = "text";

              const isDateType =
                dataType.includes("date") || dataType.includes("time");

              if (isDateType) {
                inputType = "date";
                return (
                  <React.Fragment key={fieldName}>
                    <FormField
                      control={form.control}
                      name={`${fieldName}_from`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldName} từ</FormLabel>
                          <FormControl>
                            <Input
                              type={inputType}
                              {...field}
                              placeholder={`Từ ngày ${fieldName}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`${fieldName}_to`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{fieldName} đến</FormLabel>
                          <FormControl>
                            <Input
                              type={inputType}
                              {...field}
                              placeholder={`Đến ngày ${fieldName}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </React.Fragment>
                );
              } else {
                // Non-date fields
                if (
                  dataType.includes("int") ||
                  dataType.includes("decimal") ||
                  dataType.includes("float") ||
                  dataType.includes("double")
                ) {
                  inputType = "number";
                }

                return (
                  <FormField
                    key={fieldName}
                    control={form.control}
                    name={fieldName}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldName}</FormLabel>
                        <FormControl>
                          <Input
                            type={inputType}
                            {...field}
                            placeholder={`Nhập ${fieldName}`}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              }
            })}
          </div> */}

          {/* <div className="flex flex-wrap gap-6 ml-5">
            <FormField
              control={form.control}
              name="dateDK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NgayDK từ </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="yyyy/mm/dd-yyyy/mm/dd"
                      type="date"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateDK"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NgayDK đến</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="yyyy/mm/dd-yyyy/mm/dd"
                      type="date"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={form.control}
              name="hsCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>HS code</FormLabel>
                  <FormControl>
                    <Input placeholder="ma hang hoa" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vận đơn 01</FormLabel>
                  <FormControl>
                    <Input placeholder="Số vận đơn 01 " {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mahq"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MAHQ</FormLabel>
                  <FormControl>
                    <Input placeholder="ma hai quan" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
          <Button type="submit">Tìm kiếm</Button>
          {/* <Button type="button" onClick={handleExportToExcel}>
            Excel
          </Button> */}
        </form>
      </Form>

      <MyTableBill
        {...{
          data,
          columns,
        }}
      />

      <PaginationControls table={table} data={data} />
    </>
  );
}

// Pagination controls component
function PaginationControls({ table, data }: { table: Table<any>; data: any }) {
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
    </div>
  );
}

function mapFiltered(selectedFields: string[], data: Record<string, any>) {
  return selectedFields.reduce((acc, field) => {
    const fromKey = `${field}_from`;
    const toKey = `${field}_to`;

    const hasFrom = fromKey in data;
    const hasTo = toKey in data;

    if (hasFrom || hasTo) {
      acc[field] = {};
      if (hasFrom) acc[field].from = data[fromKey];
      if (hasTo) acc[field].to = data[toKey];
    } else if (field in data) {
      acc[field] = data[field];
    }

    return acc;
  }, {} as Record<string, any>);
}
