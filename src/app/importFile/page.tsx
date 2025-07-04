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

const FormSchema = z.object({
  username: z.string(),
  dateDK: z.string().nonempty("NgayDK is required"),
  mahq: z.string(),
  hsCode: z.string(),
  numKQ: z.string().nonempty("This is required"),
});

export default function ImportFile() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  interface FileData {
    id: string;
    filename: string;
    fileHash: string;
  }
  const [files, setFiles] = useState<FileData[]>([]); // State to hold the file data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(""); // State for error handling
  const [duplicate, setDuplicate] = useState(""); // State for error handling

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

  const fetchFiles = async () => {
    console.log("Fetching files...");
    try {
      // Replace with your API endpoint
      const response = await axios.get("http://localhost:8080/api/files/");

      // If the request is successful, set the files in the state
      setFiles(response.data);
      setLoading(false); // Stop loading
    } catch (err) {
      setError("Error fetching files");
      setLoading(false); // Stop loading
    }
  };

  // const checkFile = ()=>{
  //   fetchFiles().then((x) => {
  //     console.log(x);
  //   });
  // }

  // Fetch all files when the component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDuplicate(""); // Reset duplicate error message
    if (e.target.files) {
      setFile(e.target.files[0]);
      console.log(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setIsLoad(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/excel1_jdbc/import",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      console.log(response);
      // setDuplicate(response.)

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setDuplicate(err.response.data.message);
        console.log(err.response.data.message);
      }
      // console.error("Error uploading the file", error);
    }
  };

  return (
    <div>
      <Header title="Import File "></Header>
            <Form {...form}>
        <div className="flex flex-wrap gap-6 ml-5">
          <FormField
            control={form.control}
            name="dateDK"
            render={({ field }) => (
              <FormItem className="w-1/4">
                <FormLabel>Chọn model dữ liệu import</FormLabel>
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
      </Form>



      <div className="grid w-full max-w-sm items-center gap-1.5">
        
        <br />
        <Label htmlFor="picture">FILE </Label>
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <span className="text-red-500">{duplicate}</span>

        <Button onClick={handleUpload}>Upload Nhập </Button>
      </div>
      <br />
      <br />

      <>
        <h1>📁 Tiến trình import file</h1>
        <ProgressWebSocket />
      </>
      <br />
      <br />
      <div>
        <h1
          className="text-2xl
"
        >
          Files đã tải lên database{" "}
        </h1>
        <Button onClick={fetchFiles}> checkFilE</Button>
        {files.length === 0 ? (
          <p>Danh sách file tai lên trống</p>
        ) : (
          <table
            border={1}
            style={{ width: "100%", textAlign: "left", padding: "10px" }}
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Filename</th>
                <th>File Hash</th>
                {/* Add other headers here as needed */}
              </tr>
            </thead>
            <tbody>
              {files
                .slice()
                .reverse()
                .map((file) => (
                  <tr key={file.id}>
                    <td>{file.id}</td>
                    <td>{file.filename}</td>
                    <td>{file.fileHash}</td>
                    {/* Add other table cells here as needed */}
                  </tr>
                ))}
            </tbody>
          </table>
        )}
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
