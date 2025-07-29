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
import { Label } from "@/components/ui/label";

interface TuyenDuong {
  cuaKhauDi: string;
  cuaKhauDen: string;
}

export default function TuyenDuongTrongDiem() {
  const [danhSach, setDanhSach] = useState<TuyenDuong[]>([]);
  const [openThemTay, setOpenThemTay] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  const [form, setForm] = useState<TuyenDuong>({
    cuaKhauDi: "",
    cuaKhauDen: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLuuTay = () => {
    setDanhSach([...danhSach, form]);
    setForm({ cuaKhauDi: "", cuaKhauDen: "" });
    setOpenThemTay(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<any>(sheet);

      const parsed: TuyenDuong[] = json.map((row: any) => ({
        cuaKhauDi: row.cuaKhauDi || "",
        cuaKhauDen: row.cuaKhauDen || "",
      }));

      setDanhSach([...danhSach, ...parsed]);
      setOpenExcel(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleTaiFileMau = () => {
    const sampleData = [
      {
        cuaKhauDi: "Hữu Nghị",
        cuaKhauDen: "Móng Cái",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TuyenDuongTrongDiem");

    XLSX.writeFile(workbook, "mau_tuyen_duong_trong_diem.xlsx");
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="flex space-x-4">
        {/* Nhập tay */}
        <Dialog open={openThemTay} onOpenChange={setOpenThemTay}>
          <DialogTrigger asChild>
            <Button>➕ Nhập tay</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Thêm tuyến đường thủ công</DialogTitle>
            <div className="space-y-3">
              <Label>Mã Cửa khẩu đi</Label>
              <Input
                name="cuaKhauDi"
                value={form.cuaKhauDi}
                onChange={handleChange}
              />
              <Label>Mã Cửa khẩu đến</Label>
              <Input
                name="cuaKhauDen"
                value={form.cuaKhauDen}
                onChange={handleChange}
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
            <DialogTitle>Nhập danh sách tuyến đường từ Excel</DialogTitle>
            <div className="space-y-3">
              <Label>Chọn file Excel</Label>
              <Input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Tải file mẫu */}
        <Button onClick={handleTaiFileMau}>📄 Tải file mẫu</Button>
      </div>

      {/* Hiển thị danh sách */}
      <div className="border p-4 rounded-md">
        <h3 className="font-bold mb-2">
          Danh sách tuyến đường trọng điểm đã thêm:
        </h3>
        <ul className="space-y-1 text-sm">
          {danhSach.map((item, idx) => (
            <li key={idx}>
              <strong>{item.cuaKhauDi}</strong> →{" "}
              <strong>{item.cuaKhauDen}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
