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
import Header from "@/components/header";

interface TuyenDuong {
  cuaKhauDi: string;
  cuaKhauDen: string;
  moTa: string;
}

export default function TuyenDuongTrongDiemManager() {
  const API = `http://localhost:8080`;

  const [danhSach, setDanhSach] = useState<TuyenDuong[]>([]);
  const [openThemTay, setOpenThemTay] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState<TuyenDuong>({
    cuaKhauDi: "",
    cuaKhauDen: "",
    moTa: "",
  });

  const columns: ColumnDef<TuyenDuong>[] = [
    { accessorKey: "cuaKhauDi", header: "Cửa khẩu đi" },
    { accessorKey: "cuaKhauDen", header: "Cửa khẩu đến" },
    { accessorKey: "moTa", header: "Mô tả" },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => {
        const td = row.original;
        return (
          <div className="space-x-2">
            <Button size="sm" onClick={() => handleEdit(td)}>✏️ Sửa</Button>
            <Button size="sm"             className="bg-blue-300 text-white hover:bg-red-600"
 onClick={() => handleDelete(td)}>🗑️ Xóa</Button>
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
      const res = await axios.get(`${API}/api/tuyenduong/trongdiem`);
      setDanhSach(res.data);
    } catch (err) {
      alert("❌ Không thể tải danh sách tuyến đường.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ cuaKhauDi: "", cuaKhauDen: "", moTa: "" });
    setIsEdit(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLuuTay = async () => {
    try {
      await axios.post(`${API}/api/tuyenduong/trongdiem/import`, [form]);
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

      const parsed: TuyenDuong[] = json.map((row) => ({
        cuaKhauDi: row.cuaKhauDi || "",
        cuaKhauDen: row.cuaKhauDen || "",
        moTa: row.moTa || "",
      }));

      try {
        await axios.post(`${API}/api/tuyenduong/trongdiem/import`, parsed);
        setDanhSach((prev) => [...prev, ...parsed]);
        setOpenExcel(false);
      } catch (error: any) {
        alert("❌ Lỗi import Excel: " + (error.response?.data?.message || error.message));
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleTaiFileMau = () => {
    const sampleData = [
      {
        cuaKhauDi: "Hữu Nghị",
        cuaKhauDen: "Móng Cái",
        moTa: "Tuyến đường chính qua biên giới phía Bắc",
      },
    ];
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "TuyenDuong");
    XLSX.writeFile(workbook, "mau_tuyen_duong_trong_diem.xlsx");
  };

  const handleEdit = (td: TuyenDuong) => {
    setForm(td);
    setIsEdit(true);
    setOpenThemTay(true);
  };

  const handleDelete = async (td: TuyenDuong) => {
    try {
      await axios.delete(`${API}/api/tuyenduong/trongdiem`, {
        data: td,
      });
      setDanhSach((prev) =>
        prev.filter(
          (item) =>
            item.cuaKhauDi !== td.cuaKhauDi || item.cuaKhauDen !== td.cuaKhauDen
        )
      );
    } catch (error: any) {
      alert("❌ Không xóa được: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div >
                    <Header title="Tuyến đường trọng điểm"></Header>

      <div className="space-x-4 mb-6 p-4">
        <Dialog open={openThemTay} onOpenChange={(open) => {
          setOpenThemTay(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>➕ {isEdit ? "Sửa tuyến đường" : "Nhập tay"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>{isEdit ? "Sửa tuyến đường" : "Thêm tuyến đường thủ công"}</DialogTitle>
            <div className="space-y-3">
              <Label>Cửa khẩu đi</Label>
              <Input name="cuaKhauDi" value={form.cuaKhauDi} onChange={handleChange} />
              <Label>Cửa khẩu đến</Label>
              <Input name="cuaKhauDen" value={form.cuaKhauDen} onChange={handleChange} />
              <Label>Mô tả</Label>
              <Textarea name="moTa" value={form.moTa} onChange={handleChange} />
              <Button onClick={handleLuuTay}>💾 {isEdit ? "Cập nhật" : "Lưu"}</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={openExcel} onOpenChange={setOpenExcel}>
          <DialogTrigger asChild>
            <Button>📥 Nhập từ Excel</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Nhập danh sách từ Excel</DialogTitle>
            <div className="space-y-3">
              <Label>Chọn file Excel</Label>
              <Input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
            </div>
          </DialogContent>
        </Dialog>

        <Button onClick={handleTaiFileMau}>📄 Tải file mẫu</Button>
      </div>

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
