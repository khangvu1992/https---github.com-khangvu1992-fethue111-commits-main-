"use client";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ProgressWebSocket from "@/components/ProgressWebSocket";

export default function ImportExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }
    } catch (error) {
      console.error("Error uploading the file", error);
    }
  };

  return (
    <div>
      <Header title="Import File Excel"></Header>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <br />
        <Label htmlFor="picture">FILE excel</Label>
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <Button onClick={handleUpload}>Upload</Button>
      </div>
      <br />
      <br />
      {isLoad && (
        <>
          <h1>📁 Tiến trình import file</h1>
          <ProgressWebSocket />
        </>
      )}

      {/* Thêm UI để hiển thị tiến trình ở đây */}
    </div>
  );
}
