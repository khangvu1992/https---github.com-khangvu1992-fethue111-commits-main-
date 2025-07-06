"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

const FormSchema = z.object({
  username: z.string(),
  dateDK: z.string(),
  mahq: z.string(),
  hsCode: z.string(),
  numKQ: z.string().nonempty("This is required"),
  nameTable: z.string(),
  typeTable: z.string(),
  typeTableSearch: z.string().optional(),
});

export function InputForm({ onSend }: { onSend: (data: any) => void }) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

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
      // Replace with your API endpoint
      const response = await axios.get(
        "http://localhost:8080/api/bill_search/nameColumns",
        {
          params: {
            tableName: name,
          },
        }
      );
      setNameColumns([{ columnName: "all" }, ...response.data]);

      // If the request is successful, set the files in the state
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  type OptionTableItem = {
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
      numKQ: "100",
      nameTable: "",
      typeTable: "",
      typeTableSearch: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // console.log("Data submitted:", data)
    onSend(data);
    toast("You submitted the following values", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  function handleExportToExcel(
    event: React.MouseEvent<HTMLButtonElement>
  ): void {
    throw new Error("Function not implemented.");
  }

  return (
    <>
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
                        <SelectValue placeholder="Chọn khoảng ngày" />
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
                        const column = String(opt.columnName || ""); // ép an toàn về string

                        return (
                          <label
                            key={column}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={column}
                              checked={selectedFields.includes(column)}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSelectedFields((prev) =>
                                  prev.includes(value)
                                    ? prev.filter((v) => v !== value)
                                    : [...prev, value]
                                );
                              }}
                            />
                            <span>{column}</span>
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
                      {selectedFields.length > 0
                        ? selectedFields.join(", ")
                        : "Chọn trường nhanh"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[250px] max-h-[300px] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                      {nameColumns.map((opt) => {
                        const column = String(opt.columnName || ""); // ép an toàn về string

                        return (
                          <label
                            key={column}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={column}
                              checked={selectedFields.includes(column)}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSelectedFields((prev) =>
                                  prev.includes(value)
                                    ? prev.filter((v) => v !== value)
                                    : [...prev, value]
                                );
                              }}
                            />
                            <span>{column}</span>
                          </label>
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
          </div>
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={handleExportToExcel}>
            Excel
          </Button>
        </form>
      </Form>
    </>
  );
}
