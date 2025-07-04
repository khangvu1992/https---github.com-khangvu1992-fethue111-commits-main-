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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FormSchema = z.object({
  username: z.string(),
  dateDK: z.string().nonempty("NgayDK is required"),
  mahq: z.string(),
  hsCode: z.string(),
  numKQ: z.string().nonempty("This is required"),
});

export function InputForm({ onSend }: { onSend: (data: any) => void }) {

  const dateOptions = [
  { label: "Hôm nay", value: "today" },
  { label: "7 ngày qua", value: "last7days" },
  { label: "Tháng này", value: "thisMonth" },
  { label: "Tuỳ chọn ngày", value: "custom" },
];



  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      dateDK: "",
      mahq: "",
      hsCode: "",
      numKQ: "100",
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

  function handleExportToExcel(event: React.MouseEvent<HTMLButtonElement>): void {
    throw new Error("Function not implemented.");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <div className="flex flex-wrap gap-6 ml-5">
      <FormField
  control={form.control}
  name="dateDK"
  render={({ field }) => (
    <FormItem className="w-1/4">
      <FormLabel>Table database</FormLabel>
      <FormControl>
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn khoảng ngày" />
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

      <FormField
  control={form.control}
  name="dateDK"
  render={({ field }) => (
    <FormItem className="w-1/4">
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

        <div className="flex flex-wrap gap-6 ml-5">
          <FormField
            control={form.control}
            name="dateDK"
            render={({ field }) => (
              <FormItem className="w-1/4">
                <FormLabel>NgayDK</FormLabel>
                <FormControl>
                  <Input placeholder="yyyy/mm/dd-yyyy/mm/dd" {...field} />
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
                  <Input placeholder="Gioi han so luong tim kiem" {...field} />
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
        <Button type="button" onClick={handleExportToExcel}>Excel</Button>

      </form>
    </Form>
  );
}
