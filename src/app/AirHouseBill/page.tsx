"use client";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ProgressWebSocket from "@/components/ProgressWebSocket";
import { log } from "console";

export default function ImportExcel() {
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
        "http://localhost:8080/api/AirHouseBill/import-AirHouseBill",
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
      <Header title="Import File AirHouseBill"></Header>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <br />
        <Label htmlFor="picture">FILE excel AirHouseBill</Label>
        <Input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <span className="text-red-500">{duplicate}</span>

        <Button onClick={handleUpload}>Upload AirHouseBill </Button>
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
