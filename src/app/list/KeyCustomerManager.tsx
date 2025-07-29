"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface KeyCustomer {
  maSoThue: string;
  tenCongTy: string;
  moTa: string;
  isTrongDiem: boolean;
}

export default function KeyCustomerManager() {
  const [danhSach, setDanhSach] = useState<KeyCustomer[]>([]);
  const [openThemTay, setOpenThemTay] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  const [form, setForm] = useState<KeyCustomer>({
    maSoThue: "",
    tenCongTy: "",
    moTa: "",
    isTrongDiem: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (checked: boolean) => {
    setForm({ ...form, isTrongDiem: checked });
  };

  const handleLuuTay = () => {
    setDanhSach([...danhSach, form]);
    setForm({ maSoThue: "", tenCongTy: "", moTa: "", isTrongDiem: false });
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

      const parsed: KeyCustomer[] = json.map((row: any) => ({
        maSoThue: row.maSoThue || "",
        tenCongTy: row.tenCongTy || "",
        moTa: row.moTa || "",
        isTrongDiem:
          row.isTrongDiem === true ||
          row.isTrongDiem === "true" ||
          row.isTrongDiem === 1,
      }));

      setDanhSach([...danhSach, ...parsed]);
      setOpenExcel(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleTaiFileMau = () => {
    const sampleData = [
      {
        maSoThue: "1234567890",
        tenCongTy: "Công ty TNHH ABC",
        moTa: "Khách hàng tiềm năng",
        isTrongDiem: true,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "KhachHangTrongDiem");

    XLSX.writeFile(workbook, "mau_khach_hang_trong_diem.xlsx");
  };

  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Khách hàng trọng điểm</h2>

      <div className="space-x-4 mb-6">
        {/* Nhập tay */}
        <Dialog open={openThemTay} onOpenChange={setOpenThemTay}>
          <DialogTrigger asChild>
            <Button>➕ Nhập tay</Button>
          </DialogTrigger>
          <DialogContent>
            <div className="space-y-3">
              <Label>Mã số thuế</Label>
              <Input name="maSoThue" value={form.maSoThue} onChange={handleChange} />
              <Label>Tên công ty</Label>
              <Input name="tenCongTy" value={form.tenCongTy} onChange={handleChange} />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trongdiem"
                  checked={form.isTrongDiem}
                  onCheckedChange={handleCheckbox}
                />
                <Label htmlFor="trongdiem">Khách hàng trọng điểm</Label>
              </div>
              <Label>Mô tả</Label>
              <Textarea name="moTa" value={form.moTa} onChange={handleChange} />
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
            <div className="space-y-3">
              <Label>Chọn file Excel</Label>
              <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Tải file mẫu */}
        <Button onClick={handleTaiFileMau}>📄 Tải file mẫu</Button>
      </div>
    </div>
  );
}
