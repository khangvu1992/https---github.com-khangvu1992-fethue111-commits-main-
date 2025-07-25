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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  ColumnDef,
  getCoreRowModel,
  PaginationState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import { generateColumnsFromMeta } from "@/src/util/generateColumnsFromMeta";
import { isEqual, set } from "lodash";
import Header from "@/components/header";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function dashboard() {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedFieldsView, setSelectedFieldsView] = useState<string[]>([]);
  const [selectedFieldsOrder, setSelectedFieldsOrder] = useState<string[]>([]);

  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);
  const [allColumns, setAllColumns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [removeDuplicate, setRemoveDuplicate] = useState(false);
  const [duplicateColumn, setDuplicateColumn] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [data, setData] = useState<any | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const host = window.location.hostname;
  const API = `http://${host}:8080`;

  useEffect(() => {
    if (selectedFieldsView.length === 0) {
      const generated1 = generateColumnsFromMeta(allColumns);
      setColumns(generated1);
      return;
    } else {
      const filtered = filterSelectedFields(allColumns, selectedFieldsView);
      const generated2 = generateColumnsFromMeta(filtered);
      setColumns(generated2);
    }
  }, [selectedFieldsView, allColumns]);

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
  };

  useEffect(() => {
    fetchData();
    fetchDataReal(0, 10, []);
  }, []);

  const fetchData = async () => {
    try {
      // Replace with your API endpoint
      const response = await axios.get(`${API}/api/bill_search`);
      setOptionTable(response.data);

      // If the request is successful, set the files in the state
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  const fetchData2 = async (name: string) => {
    try {
      const response = await axios.get(`${API}/api/bill_search/nameColumns`, {
        params: {
          tableName: name,
        },
      });

      const newMeta = response.data;
      // So sánh trực tiếp nameColumns gốc (metadata)
      setNameColumnsOrder(newMeta);
      const newMetaWithAll = [...newMeta];
      // const newMetaWithAll = [{ columnName: "all" }, ...newMeta];

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
      setAllColumns(newMeta);
      setColumns(generated);
      console.log(allColumns);
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

  const FormSchema = z
    .object({
      nameTable: z.string(),
    })
    .catchall(z.string().optional());

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      // username: "",
      // dateDK: "",
    },
  });

  const exportExcel = async (data: z.infer<typeof FormSchema>) => {
    setIsLoadingExcel(true); // Bật loading nếu bạn muốn

    try {
      const fieldNames = selectedFields.map((field) => field.split("**")[0]);
      const filtered = mapFiltered(fieldNames, data);
      const cleaned = cleanFilterObject(filtered);

      const duplicateColumn2 = nameColumns.find(
        (col) => col.columnName === "sotk" || col.columnName === "so_to_khai"
      );

      const payload = {
        nameTable: data.nameTable,
        selectedFields: selectedFieldsView,
        filtered: cleaned,
        order: selectedFieldsOrder,
        removeDuplicate: removeDuplicate,
        duplicateColumn: duplicateColumn2?.columnName ?? null,
      };

      const response = await fetch(`${API}/api/bill_search1/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Export thất bại");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ket_qua.xlsx";
      a.click();
      toast.success("✅ Xuất Excel thành công!");
    } catch (error) {
      console.error("Lỗi export:", error);
      toast.error("❌ Lỗi khi xuất Excel");
    } finally {
      setIsLoadingExcel(false); // Tắt loading
    }
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true); // 👉 bật loading

    try {
      const fieldNames = selectedFields.map((field) => field.split("**")[0]);

      const filtered = mapFiltered(fieldNames, data);

      const cleaned = cleanFilterObject(filtered);
      const duplicateColumn2 = nameColumns.find(
        (col) => col.columnName === "sotk" || col.columnName === "so_to_khai"
      );

      let payload2 = {
        nameTable: data.nameTable,
        // numRows: data.numKQ,
        pagination: pagination,
        selectedFields: selectedFieldsView,
        filtered: cleaned,
        order: selectedFieldsOrder,
        removeDuplicate: removeDuplicate,
        duplicateColumn: duplicateColumn2?.columnName ?? null,
      };

      const response = await axios.post(
        `${API}/api/bill_search1/find`,
        payload2
      );

      // Gửi dữ liệu kết quả sang bảng

      setData(response);

      toast.success("Tìm kiếm thành công!");
    } catch (err) {
      console.error("Error during search:", err);
      toast.error("Lỗi khi tìm kiếm");
    } finally {
      setIsLoading(false); // 👉 tắt loading dù thành công hay thất bại
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
              render={({ field }) => {
                const [open, setOpen] = useState(false);
                return (
                  <FormItem>
                    <FormLabel>Table database</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value || "Chọn table"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Tìm table..." />
                          <CommandList>
                            {optionTable.map((opt) => (
                              <CommandItem
                                key={opt.tableName}
                                value={opt.tableName}
                                onSelect={(val: string) => {
                                  field.onChange(val);
                                  fetchData2(val);
                                  setOpen(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === opt.tableName
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {opt.tableName}
                              </CommandItem>
                            ))}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormItem>
              <FormLabel>Thêm trường tìm kiếm</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">
                      {selectedFields.length > 0
                        ? selectedFields.map((v) => v.split("**")[0]).join(", ")
                        : "Chọn trường nhanh"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] max-h-[300px] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {/* Ô tìm kiếm trường */}
                      <input
                        type="text"
                        placeholder="Tìm trường..."
                        className="border p-1 rounded text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />

                      {/* Danh sách trường đã lọc */}
                      {nameColumns
                        .filter((opt) =>
                          String(opt.columnName)
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        )
                        .map((column) => {
                          const value = `${column.columnName}**${column.dataType}`;
                          return (
                            <label
                              key={column.columnName}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="checkbox"
                                value={value}
                                checked={selectedFields.includes(value)}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setSelectedFields((prev) =>
                                    prev.includes(val)
                                      ? prev.filter((v) => v !== val)
                                      : [...prev, val]
                                  );
                                }}
                              />
                              <span>{column.columnName}</span>
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

          <Button type="submit" disabled={isLoading}>
            {" "}
            {isLoading ? "Đang tìm kiếm..." : "Tìm kiếm"}
          </Button>

          <span> </span>
          <Button
            type="button"
            onClick={() => setOpenConfirm(true)}
            disabled={isLoadingExcel}
          >
            {" "}
            {isLoadingExcel ? "Đang tạo..." : "Excel"}
          </Button>
          {/* <Button type="button" onClick={handleExportToExcel}>
            Excel
          </Button> */}
          <TooltipProvider>
            <div className="flex items-center space-x-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  {/* Quan trọng: asChild để Switch vẫn hoạt động */}
                  <div>
                    <Switch
                      id="airplane-mode"
                      checked={removeDuplicate}
                      onCheckedChange={setRemoveDuplicate}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Loại bỏ trùng lặp tờ khai(chỉ áp dụng cho nhập khẩu hoặc
                    xuất khẩu (sotk, so_to_khai)) , tờ khai có 12 chữ số, 11 chữ
                    số đầu là giống nhau, chữ số cuối (thứ 12) là khác nhau. Nếu
                    trường hợp này xảy ra thì lựa chọn (Lọc) lấy theo số lớn
                    nhất. Ví dụ: 100000000001 và 10000000000 thì lấy số tờ khai
                    có đuôi số 1. Số tờ khai chỉnh sửa lớn nhất là số thứ 9.
                  </p>
                </TooltipContent>
              </Tooltip>
              <label htmlFor="airplane-mode">Remove Duplicate</label>
            </div>
          </TooltipProvider>
        </form>
      </Form>
      <PaginationControls table={table} data={data} /> 

      <MyTableBill
        {...{
          pagination,
          data: data?.data,
          columns,
        }}
      />
            <span className="ml-2 text-sm ">kim ngạch xuất khẩu: {data?.data?.total}4343</span>


       <Header title="Thống kê"></Header>

      <ConfirmDialog
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={
          <span>
            Bạn chắc chắn export{" "}
            <span className="text-red-600 font-semibold">
              {data?.data?.total?.toLocaleString()}
            </span>{" "}
            kết quả tìm kiếm?
          </span>
        }
        description="Hành động này không thể hoàn tác, phải chờ một chút để hệ thống xử lý dữ liệu, phải ấn Tìm kiếm trước khi export excel"
        onConfirm={() => exportExcel(form.getValues())}
      />
    </>
  );
}

// Pagination controls component
function PaginationControls({
  table,
  data,
}: {
  table: Table<any>;
  data?: any;
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
        Trang <strong>{table.getState().pagination.pageIndex + 1}</strong>
      </span>

      <div className="flex items-center gap-2">
        <span className="text-sm">| Đến trang:</span>
        <Input
          type="number"
          min={1}
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
      <span className="ml-2 text-sm  ">Kết quả: {data?.data?.total}</span>
      <span className="ml-2 text-sm bg-orange-200">Tổng  tờ khai: {data?.data?.total}5656454</span>
      <span className="ml-2 text-sm bg-yellow-200 ">Doanh nghiệp: {data?.data?.total}4343</span>
      <span className="ml-2 text-sm bg-lime-200 ">Doanh nghiệp trọng điểm: {data?.data?.total}4343</span>


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

function cleanFilterObject(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      if (value === null || value === "" || value === undefined) {
        return false; // ❌ xoá nếu là string rỗng, null, undefined
      }

      if (typeof value === "object") {
        if (value === null) return false;

        const hasValidFrom =
          "from" in value && value.from != null && value.from !== "";
        const hasValidTo = "to" in value && value.to != null && value.to !== "";

        return hasValidFrom || hasValidTo;
      }

      return true; // ✅ giữ nếu là kiểu dữ liệu khác (string, number, boolean, ...) và có giá trị
    })
  );
}

function filterSelectedFields(
  allFields: any[],
  selectedFieldsView: string[]
): any[] {
  return allFields.filter((field) =>
    selectedFieldsView.includes(field.columnName)
  );
}
