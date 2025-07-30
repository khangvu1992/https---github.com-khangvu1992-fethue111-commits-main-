"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

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

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

interface HsCode {
  maHs: string;
  moTa: string;
}

export default function HsCodeTrongDiemManager() {
  const API = `http://localhost:8080`;

  const [danhSach, setDanhSach] = useState<HsCode[]>([]);
  const [form, setForm] = useState<HsCode>({ maHs: "", moTa: "" });
  const [isEdit, setIsEdit] = useState(false);
  const [openThemTay, setOpenThemTay] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  const columns: ColumnDef<HsCode>[] = [
    { accessorKey: "maHs", header: "Mã HS" },
    { accessorKey: "moTa", header: "Mô tả" },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="space-x-2">
            <Button size="sm" onClick={() => handleEdit(item)}>✏️ Sửa</Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleDelete(item.maHs)}
            >
              🗑️ Xóa
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: danhSach,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API}/api/hs-code-trongdiem`);
      setDanhSach(res.data);
    } catch (error) {
      alert("❌ Không thể tải dữ liệu HS Code.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ maHs: "", moTa: "" });
    setIsEdit(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLuuTay = async () => {
    try {
      await axios.post(`${API}/api/hs-code-trongdiem/import`, [form]);
      if (!isEdit) setDanhSach((prev) => [...prev, form]);
      else fetchData();
      resetForm();
      setOpenThemTay(false);
    } catch (error: any) {
      alert("❌ Lỗi khi lưu: " + (error.response?.data?.message || error.message));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<any>(sheet);

      const parsed: HsCode[] = json.map((row: any) => ({
        maHs: row.maHs || "",
        moTa: row.moTa || "",
      }));

      try {
        await axios.post(`${API}/api/hs-code-trongdiem/import`, parsed);
        setDanhSach((prev) => [...prev, ...parsed]);
        setOpenExcel(false);
      } catch (error: any) {
        alert("❌ Lỗi khi import Excel: " + (error.response?.data?.message || error.message));
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleTaiFileMau = () => {
    const sampleData = [{ maHs: "010120", moTa: "Thịt bò đông lạnh không xương" }];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "HSCode");
    XLSX.writeFile(workbook, "mau_hs_code_trong_diem.xlsx");
  };

  const handleEdit = (item: HsCode) => {
    setForm(item);
    setIsEdit(true);
    setOpenThemTay(true);
  };

  const handleDelete = async (maHs: string) => {
    try {
      await axios.delete(`${API}/api/hs-code-trongdiem/${maHs}`);
      setDanhSach((prev) => prev.filter((d) => d.maHs !== maHs));
    } catch (error: any) {
      alert("❌ Không xóa được: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="p-4">
      <div className="space-x-4 mb-6">
        {/* Nhập tay */}
        <Dialog
          open={openThemTay}
          onOpenChange={(open) => {
            setOpenThemTay(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>➕ {isEdit ? "Sửa mã HS" : "Nhập tay"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{isEdit ? "Sửa mã HS" : "Thêm mã HS thủ công"}</DialogTitle>
            <div className="space-y-3">
              <Label>Mã HS</Label>
              <Input
                name="maHs"
                value={form.maHs}
                onChange={handleChange}
                disabled={isEdit}
              />
              <Label>Mô tả</Label>
              <Textarea name="moTa" value={form.moTa} onChange={handleChange} />
              <Button onClick={handleLuuTay}>💾 {isEdit ? "Cập nhật" : "Lưu"}</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Nhập Excel */}
        <Dialog open={openExcel} onOpenChange={setOpenExcel}>
          <DialogTrigger asChild>
            <Button>📥 Nhập từ Excel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Nhập danh sách từ file Excel</DialogTitle>
            <div className="space-y-3">
              <Label>Chọn file Excel</Label>
              <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Tải file mẫu */}
        <Button onClick={handleTaiFileMau}>📄 Tải file mẫu</Button>
      </div>

      {/* Bảng dữ liệu */}
      <table className="w-full border text-sm">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gray-100">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-4 py-2 text-left border-b">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
