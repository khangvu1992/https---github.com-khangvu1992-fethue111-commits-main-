"use client";

import Header from "@/components/header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import ProgressWebSocket from "@/components/ProgressWebSocket";

export default function ImportExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoad, setIsLoad] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  interface FileData {
    id: string;
    filename: string;
    fileHash: string;
  }
  const [files, setFiles] = useState<FileData[]>([]);  // State to hold the file data
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState(''); // State for error handling

  // Fetch all files when the component mounts
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        // Replace with your API endpoint
        const response = await axios.get('http://localhost:8080/api/files/');
        
        // If the request is successful, set the files in the state
        setFiles(response.data);
        setLoading(false); // Stop loading
      } catch (err) {
        setError('Error fetching files');
        setLoading(false); // Stop loading
      }
    };

    fetchFiles();
  }, []); 

  




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
      
        <>
          <h1>📁 Tiến trình import file</h1>
          <ProgressWebSocket />
        </>
    

<div>
      <h1>Files đã tải lên database </h1>
      {files.length === 0 ? (
        <p>No files found.</p>
      ) : (
        <table border={1} style={{ width: '100%', textAlign: 'left', padding: '10px' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Filename</th>
              <th>File Hash</th>
              {/* Add other headers here as needed */}
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
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
