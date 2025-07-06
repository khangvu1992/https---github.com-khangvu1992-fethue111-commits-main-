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
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { generateColumnsFromMeta } from "@/src/util/generateColumnsFromMeta";
import { isEqual } from "lodash";
import Header from "@/components/header";

const FormSchema = z
  .object({
    username: z.string(),
    dateDK: z.string(),
    mahq: z.string(),
    hsCode: z.string(),
    numKQ: z.string().nonempty("This is required"),
    nameTable: z.string(),
    typeTable: z.string(),
    typeTableSearch: z.string().optional(),
  })
  .catchall(z.string().optional());

export default function dashboard({ onSend }: { onSend: (data: any) => void }) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedFieldsView, setSelectedFieldsView] = useState<string[]>([]);

  const formatNumber = (number: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 3, // Đảm bảo có 2 chữ số sau dấu phẩy
      maximumFractionDigits: 3, // Đảm bảo không có quá 2 chữ số sau dấu phẩy
    }).format(number);
  };

  const [columns, setColumns] = useState<ColumnDef<any>[]>([]);

  useEffect(() => {
    fetchData();
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
      const newMetaWithAll = [{ columnName: "all" }, ...newMeta];

      // Nếu metadata không thay đổi thì không làm gì
      const isSame = isEqual(nameColumns, newMetaWithAll);
      if (isSame) return;

      // Nếu khác thì set lại tất cả
      setNameColumns(newMetaWithAll);
      setSelectedFields([]);
      setSelectedFieldsView([]);

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

  const typeOptionsTable = [
    { label: "Nhập khẩu", value: "nhapKhau" },
    { label: "Xuất khẩu", value: "xuatKhau" },
    { label: "SeawayMasterBill", value: "SeawayMasterBill" },
    { label: "SeawayHouseBill", value: "SeawayHouseBill" },
    { label: "AirMasterBill", value: "AirMasterBill" },
    { label: "AirHouseBill", value: "AirHouseBill" },
    { label: "Vận Đơn", value: "VanDon" },
  ];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      dateDK: "",
      mahq: "",
      hsCode: "",
      numKQ: "1000",
      typeTable: "",
      typeTableSearch: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      const payload = {
        ...data,
        selectedFields,
        selectedFieldsView,
      };

      const response = await axios.post(
        "http://localhost:8080/api/bill_search/search",
        payload
      );

      // Gửi dữ liệu kết quả sang bảng
      onSend(response.data); // hoặc setData nếu bạn giữ state ở đây
      toast.success("Tìm kiếm thành công!");
    } catch (err) {
      console.error("Error during search:", err);
      toast.error("Lỗi khi tìm kiếm");
    }
  }

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

            <FormField
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
            />
          </div>

          <div className="flex flex-wrap gap-6 ml-5">
            {selectedFields.map((field) => {
              const [fieldName, rawType] = field.split("**");
              const dataType = rawType?.toLowerCase() || "";
              let inputType = "text";

              if (dataType.includes("date") || dataType.includes("time")) {
                inputType = "date";
              } else if (
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
            })}

      
          </div>

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
          // data,
          columns,
        }}
      />
    </>
  );
}
