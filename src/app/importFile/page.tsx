"use client";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ProgressWebSocket from "@/components/ProgressWebSocket";
import { log } from "console";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImportExcel from "../importExcel/page";
import ImportExcelExport from "../exportExcel/page";
import ImportExcelSeawayMasterBill from "../SeawayMasterBill/page";
import ImportExcelSeawayHouseBill from "../SeawayHouseBill/page";
import ImportExcelAirMasterBill from "../AirMasterBill/page";
import ImportExcelAirHouseBill from "../AirHouseBill/page";
import ImportExcelVanDon from "../VanDon/page";

const FormSchema = z.object({
  slectModel: z.string(),
});

export default function ImportFile() {
  const dateOptions = [
    { label: "Excel Nhập Khẩu", value: "nhapKhau" },
    { label: "Excel Xuất Khẩu", value: "xuatKhau" },
    { label: "CSV SeawayMasterBill", value: "SeawayMasterBill" },
    { label: "CSV SeawayHouseBill", value: "SeawayHouseBill" },
    { label: "CSV AirMasterBill", value: "AirMasterBill" },
    { label: "CSV AirHouseBill", value: "AirHouseBill" },
    { label: "Excel Vận Đơn", value: "VanDon" },
  ];

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      slectModel: "",
    },
  });

  const selectedModelType = form.watch("slectModel");

  return (
    <div>
      <Header title="Import File "></Header>
   <br />
      <Form {...form}>
        <div className="flex flex-wrap gap-6 ml-5">
          <FormField
            control={form.control}
            name="slectModel"
            render={({ field }) => (
              <FormItem className="w-1/4">
                <FormLabel>Chọn model dữ liệu import</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn model dữ liệu" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateOptions.map((opt) => (
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
        </div>
      </Form>
      <br />
      <div className="gap-6 ml-5">
             {selectedModelType === "nhapKhau" && <ImportExcel />}
     {selectedModelType === "xuatKhau" && <ImportExcelExport />}
     {selectedModelType === "SeawayMasterBill" && <ImportExcelSeawayMasterBill />}
     {selectedModelType === "SeawayHouseBill" && <ImportExcelSeawayHouseBill />}
     {selectedModelType === "AirMasterBill" && <ImportExcelAirMasterBill />}
     {selectedModelType === "AirHouseBill" && <ImportExcelAirHouseBill />}
     {selectedModelType === "VanDon" && <ImportExcelVanDon />}

      </div>



      {/* Thêm UI để hiển thị tiến trình ở đây */}
    </div>
  );
}
function onSend(data: {
  username: string;
  dateDK: string;
  mahq: string;
  hsCode: string;
  numKQ: string;
}) {
  throw new Error("Function not implemented.");
}
