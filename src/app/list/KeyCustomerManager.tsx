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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";


interface DoanhNghiep {
  maSoThue: string;
  tenCongTy: string;
  moTa: string;
  isTrongDiem: boolean;
}

export default function DoanhNghiepTrongDiemManager() {
  const API = `http://localhost:8080`;

  const [danhSach, setDanhSach] = useState<DoanhNghiep[]>([]);
  const [openThemTay, setOpenThemTay] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [form, setForm] = useState<DoanhNghiep>({
    maSoThue: "",
    tenCongTy: "",
    moTa: "",
    isTrongDiem: false,
  });

  const columns: ColumnDef<DoanhNghiep>[] = [
  {
    accessorKey: "maSoThue",
    header: "Mã số thuế",
  },
  {
    accessorKey: "tenCongTy",
    header: "Tên công ty",
  },
  {
    accessorKey: "moTa",
    header: "Mô tả",
  },
  {
    accessorKey: "isTrongDiem",
    header: "Trọng điểm",
    cell: ({ getValue }) =>
      getValue<boolean>() ? (
        <span className="text-red-600 font-semibold">✔️</span>
      ) : (
        ""
      ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const dn = row.original;
      return (
        <div className="space-x-2">
          <Button size="sm" onClick={() => handleEdit(dn)}>
            ✏️ Sửa
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => handleDelete(dn.maSoThue)}
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
      const res = await axios.get(`${API}/api/doanhnghiep/trongdiem`);
      setDanhSach(res.data);
    } catch (error) {
      alert("❌ Không thể tải dữ liệu doanh nghiệp.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ maSoThue: "", tenCongTy: "", moTa: "", isTrongDiem: false });
    setIsEdit(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    setForm({ ...form, isTrongDiem: !!checked });
  };

  const handleLuuTay = async () => {
    try {
      await axios.post(`${API}/api/doanhnghiep/trongdiem/import`, [form]);
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

      const parsed: DoanhNghiep[] = json.map((row: any) => ({
        maSoThue: row.maSoThue || "",
        tenCongTy: row.tenCongTy || "",
        moTa: row.moTa || "",
        isTrongDiem:
          row.isTrongDiem === true ||
          row.isTrongDiem === "true" ||
          row.isTrongDiem === 1,
      }));

      try {
        await axios.post(`${API}/api/doanhnghiep/trongdiem/import`, parsed);
        setDanhSach((prev) => [...prev, ...parsed]);
        setOpenExcel(false);
      } catch (error: any) {
        alert(
          "❌ Lỗi khi import Excel: " +
            (error.response?.data?.message || error.message)
        );
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleTaiFileMau = () => {
    const sampleData = [
      {
        maSoThue: "1234567890",
        tenCongTy: "Công ty TNHH ABC",
        moTa: "Doanh nghiệp ưu tiên",
        isTrongDiem: true,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DoanhNghiep");
    XLSX.writeFile(workbook, "mau_doanh_nghiep_trong_diem.xlsx");
  };

  const handleEdit = (dn: DoanhNghiep) => {
    setForm({ ...dn });
    setIsEdit(true);
    setOpenThemTay(true);
  };

  const handleDelete = async (maSoThue: string) => {
    try {
      await axios.delete(`${API}/api/doanhnghiep/trongdiem/${maSoThue}`);
      setDanhSach((prev) => prev.filter((d) => d.maSoThue !== maSoThue));
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
            <Button>➕ {isEdit ? "Sửa thông tin" : "Nhập tay"}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              {isEdit ? "Sửa doanh nghiệp" : "Thêm doanh nghiệp thủ công"}
            </DialogTitle>
            <div className="space-y-3">
              <Label>Mã số thuế</Label>
              <Input
                name="maSoThue"
                value={form.maSoThue}
                onChange={handleChange}
                disabled={isEdit}
              />
              <Label>Tên công ty</Label>
              <Input
                name="tenCongTy"
                value={form.tenCongTy}
                onChange={handleChange}
              />
              <Label>Mô tả</Label>
              <Textarea
                name="moTa"
                value={form.moTa}
                onChange={handleChange}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="trongdiem"
                  checked={form.isTrongDiem}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="trongdiem">Doanh nghiệp trọng điểm</Label>
              </div>
              <Button onClick={handleLuuTay}>
                💾 {isEdit ? "Cập nhật" : "Lưu"}
              </Button>
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
