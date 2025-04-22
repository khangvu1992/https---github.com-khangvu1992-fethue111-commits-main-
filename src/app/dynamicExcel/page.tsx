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
    formData.append("tableInfo", JSON.stringify({
      
        tableName: "edto_khai_hang_hoa",
    
        columns: [
    
        {
            "name": "sotk",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_dk",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_dv",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_dv",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_dv_doitac",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_lh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "stthang",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "mahs",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_hang",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "soluong",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dvt_soluong",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "soluong2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dvt_soluong2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "manuoc_xuatxu",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "tennuoc_xuatxu",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dongia_hd",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_nt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dvt_dongia",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "trigia_hd",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "trigia_tt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "matien_tt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "trigia_tt_thucong",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dongia_tt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dvt_dongia_tt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "sotk1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "mahq",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "malh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ptvc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_ptvc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_vc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "tenhq_short",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_dk1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_hoanthanh_kt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_gph",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_gph_v5",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_hangve_baoquan",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_thongquan",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_qua_kvgs",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "luong",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_dv1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_dv1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_bc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dia_chi_dv",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "sdt_dv",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_dv_uythac",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_dv_uythac",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_dv_doitac",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_dv_doitac1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_bc_dvdt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dia_chi_doitac_1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dia_chi_doitac_2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dia_chi_doitac_3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dia_chi_doitac_4",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "nuoc_xk",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "nuoc_nk",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "uythac_xk",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_van_don",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "trong_luong",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dvt_trong_luong",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_luong",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dvt_so_luong",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_luong_cont",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_dd_luu_kho",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_dd_luu_kho",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_dd_dich",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_cuakhau",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_cuakhau",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_cuakhau_nn",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_cuakhau_nn",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_giayphep",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_giayphep",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_inv",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_invoice",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "loai_inv",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_e_inv",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_phanloai_inv",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_incoterm",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "phuongthuc_tt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "tong_trigia_inv",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_nt1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "tong_trigia_tt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_tien_tt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_tygia_tt",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "tygia",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_tygia_tt2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "tygia2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_tygia_tt3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "tygia3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "phi_bh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_bh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_tien_bh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "phi_vc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_vc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_tien_vc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ghi_chu",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_dong_hang",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "canbo_kiemtra",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "canbo_kiemhoa",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_trangthai_tk",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_phanloai_cuoi",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "sotk_dautien",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "stt_tk_nhanh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "tongso_tk_nhanh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "sotk_tntx",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_phanloai_kt1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_phanloai_kt3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_phanloai_hh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "phanloai_tochuc_canhan",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "nhom_xl_hs",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "thoihan_tntx",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_daily_hq",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_daily_hq",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_nhanvien_hq",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_ptvc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "kyhieu_sohieu",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_vbpq1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_vbpq2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_vbpq3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_vbpq4",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_vbpq5",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_thoihan_nopthue",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "nguoi_nopthue",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "phanloai_nopthue",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "tongsotrang_tk",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_nganhang",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "nam_nganhang",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "kyhieu_baolanh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "sochungtu_baolanh",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "soluongkien_kiemhoa",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "soluongcont_kiemhoa",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "flag_kiemhoa_toanbo",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "phanloai_dinhkem1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_dinhkem1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "phanloai_dinhkem2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_dinhkem2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "phanloai_dinhkem3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_dinhkem3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_denghi_bp",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngaynhapkho_dautien",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_khoihanh_vc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "trungchuyen_baothue1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngayden_trungchuyen1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngaydi_trungchuyen1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "trungchuyen_baothue2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngayden_trungchuyen2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngaydi_trungchuyen2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "trungchuyen_baothue3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngayden_trungchuyen3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngaydi_trungchuyen3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_den_vc",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "so_quanly_noibo",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "diadiem_xephang_lenxe1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "diadiem_xephang_lenxe2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "diadiem_xephang_lenxe3",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "diadiem_xephang_lenxe4",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "diadiem_xephang_lenxe5",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ten_diadiem_xephang",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "diachi_xephang",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "kieu_huy",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_huy",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "lydo_huy",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ngay_huy",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "sotk2",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "stthang1",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_sacthue",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_bieuthue",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "thuesuat",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "phanloai_thuesuat",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "thuesuat_vnaccs",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_miengiam",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dieukhoan_miengiam",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "sotien_miengiam",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "sotien_thue",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "thue_tuyetdoi",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "soluong_tinhthue",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "dvt_tinhthue",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "ma_phanloai_thuesuat",
            "type": "NVARCHAR(255)"
        },
        {
            "name": "sotien_giamthue",
            "type": "NVARCHAR(255)"
        }
        ]
    
    }));
  
    setIsLoad(true);
  
    try {
      const response = await axios.post(
        "http://localhost:8080/api/excel/import-dynamic",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log(response.data);
      console.log(response);
  
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input value
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setDuplicate(err.response.data.message);
        console.log(err.response.data.message);
      } else {
        console.error("Unexpected error uploading the file", err);
      }
    } finally {
      setIsLoad(false);
    }
  };
  

  return (
    <div>
      <Header title="Import File Excel Xuất Khẩu"></Header>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <br />
        <Label htmlFor="picture">FILE excel </Label>
        <Input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <span className="text-red-500">{duplicate}</span>

        <Button onClick={handleUpload}>Upload Xuất </Button>
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
