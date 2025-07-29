"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface HsCode {
  maHs: string;
  moTa: string;
}

export default function Page() {
  const [danhSach, setDanhSach] = useState<HsCode[]>([]);
  const [openThemTay, setOpenThemTay] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  const [form, setForm] = useState<HsCode>({
    maHs: "",
    moTa: "",
  });

  // Xử lý thay đổi input/textarea
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Lưu mã HS được nhập thủ công
  const handleLuuTay = () => {
    if (!form.maHs.trim()) return;
    setDanhSach([...danhSach, form]);
    setForm({ maHs: "", moTa: "" });
    setOpenThemTay(false);
  };

  // Xử lý khi chọn file Excel
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<any>(sheet);

      const parsed: HsCode[] = json.map((row: any) => ({
        maHs: row.maHs || "",
        moTa: row.moTa || "",
      }));

      setDanhSach((prev) => [...prev, ...parsed]);
      setOpenExcel(false);
    };

    reader.readAsBinaryString(file);
  };

  // Tạo và tải file Excel mẫu
  const handleTaiFileMau = () => {
    const sampleData = [
      { maHs: "010120", moTa: "Thịt bò đông lạnh không xương" },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HsCodeTrongDiem");

    XLSX.writeFile(workbook, "mau_hs_code_trong_diem.xlsx");
  };

  return (
    <div className="p-4 space-y-4">
      {/* Nhóm nút chức năng */}
      <div className="flex space-x-4">
        {/* Nhập tay */}
        <Dialog open={openThemTay} onOpenChange={setOpenThemTay}>
          <DialogTrigger asChild>
            <Button>➕ Nhập tay</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Thêm mã HS thủ công</DialogTitle>
            <div className="space-y-3">
              <Label>Mã HS</Label>
              <Input
                name="maHs"
                value={form.maHs}
                onChange={handleChange}
                placeholder="Ví dụ: 010120"
              />
              <Label>Mô tả</Label>
              <Textarea
                name="moTa"
                value={form.moTa}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về mã HS"
              />
              <Button onClick={handleLuuTay}>Lưu</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Nhập từ Excel */}
        <Dialog open={openExcel} onOpenChange={setOpenExcel}>
          <DialogTrigger asChild>
            <Button>📥 Nhập từ Excel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Nhập danh sách mã HS từ Excel</DialogTitle>
            <div className="space-y-3">
              <Label>Chọn file Excel</Label>
              <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Tải file mẫu */}
        <Button onClick={handleTaiFileMau}>📄 Tải file mẫu</Button>
      </div>

      {/* Hiển thị danh sách mã HS */}
      <div className="border p-4 rounded-md bg-gray-50">
        <h3 className="font-bold mb-2">Danh sách mã HS đã thêm:</h3>
        {danhSach.length === 0 ? (
          <p className="text-sm italic text-gray-500">Chưa có dữ liệu.</p>
        ) : (
          <ul className="space-y-1 text-sm list-disc pl-5">
            {danhSach.map((item, idx) => (
              <li key={idx}>
                <strong>{item.maHs}</strong>: {item.moTa}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
