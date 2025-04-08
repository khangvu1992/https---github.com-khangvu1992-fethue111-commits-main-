"use client";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from 'axios';
import { Button } from "@/components/ui/button";
import ProgressWebSocket from "@/components/ProgressWebSocket";


export default function ImportExcel() {

    const [file, setFile] = useState<File | null>(null);

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

        try {
            const response = await axios.post("http://localhost:8080/api/excel1_jdbc/import", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log(response.data);
        } catch (error) {
            console.error("Error uploading the file", error);
        }
    };



  return (
    <div>
      <Header title="bang du lieu"></Header>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="picture">FILE excel</Label>
        <Input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <Button onClick={handleUpload}>Upload</Button>

      </div>
      <ProgressWebSocket />
      <h1>📁 Tiến trình import file</h1>
      {/* Thêm UI để hiển thị tiến trình ở đây */}
    </div>
  );
}
