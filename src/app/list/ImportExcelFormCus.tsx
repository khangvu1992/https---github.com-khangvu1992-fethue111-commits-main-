// "use client";
// import * as XLSX from "xlsx";
// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Label } from "@/components/ui/label";

// interface KeyCustomer {
//   maSoThue: string;
//   tenCongTy: string;
//   moTa: string;
//   isTrongDiem: boolean;
// }

// export default function ImportExcelFormCus() {
//   const [danhSach, setDanhSach] = useState<KeyCustomer[]>([]);
//   const [fileName, setFileName] = useState<string | null>(null);

//   const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setFileName(file.name);

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const data = new Uint8Array(evt.target?.result as ArrayBuffer);
//       const workbook = XLSX.read(data, { type: "array" });
//       const sheet = workbook.Sheets[workbook.SheetNames[0]];
//       const jsonData = XLSX.utils.sheet_to_json<any>(sheet);

//       const parsed: KeyCustomer[] = jsonData.map((row) => ({
//         maSoThue: row.maSoThue || "",
//         tenCongTy: row.tenCongTy || "",
//         moTa: row.moTa || "",
//         isTrongDiem:
//           row.isTrongDiem === true ||
//           row.isTrongDiem === "true" ||
//           row.isTrongDiem === 1,
//       }));

//       setDanhSach(parsed);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const handleSaveToAPI = async () => {
//     try {
//       const res = await fetch("/api/save-customers", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(danhSach),
//       });

//       const data = await res.json();
//       alert("✅ Đã lưu thành công!");
//     } catch (err) {
//       console.error("Lỗi khi gửi API:", err);
//       alert("❌ Lưu thất bại!");
//     }
//   };

//   return (
//     <div className="p-6 space-y-4">
//       <Label htmlFor="excel">📁 Chọn file Excel:</Label>
//       <Input type="file" accept=".xlsx,.xls" onChange={handleImportExcel} />

//       {fileName && <p className="text-sm text-muted">Đã chọn: {fileName}</p>}

//       {danhSach.length > 0 && (
//         <>
//           <div className="mt-4 border p-3 rounded-md">
//             <h3 className="font-bold mb-2">📋 Danh sách đọc từ Excel:</h3>
//             <ul className="space-y-2">
//               {danhSach.map((item, idx) => (
//                 <li key={idx} className="border p-2 rounded-md">
//                   <p><strong>MST:</strong> {item.maSoThue}</p>
//                   <p><strong>Công ty:</strong> {item.tenCongTy}</p>
//                   <p><strong>Trọng điểm:</strong> {item.isTrongDiem ? "✅ Có" : "❌ Không"}</p>
//                   <p><strong>Mô tả:</strong> {item.moTa}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <Button onClick={handleSaveToAPI} className="mt-4">
//             💾 Gửi lên server
//           </Button>
//         </>
//       )}
//     </div>
//   );
// }
