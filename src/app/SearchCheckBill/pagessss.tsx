"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import { useSelector } from "react-redux";
// import { Button } from "../../../components/ui/button";
// import { Input } from "../../../components/ui/input";

// If loading a variable font, you don't need to specify the font weight

import {
  Column,
  ColumnDef,
  PaginationState,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { makeData, Person } from "@/makeData";
import MyTableBill from "@/components/tableBill";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function dashboard() {
  const rerender = React.useReducer(() => ({}), {})[1];




  const dataFromChild = useSelector((state: any) => state.data.dataFromChild);

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);}
  


  const formatNumber = (number: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 3, // Đảm bảo có 2 chữ số sau dấu phẩy
      maximumFractionDigits: 3, // Đảm bảo không có quá 2 chữ số sau dấu phẩy
    }).format(number);
  };
  
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      // { accessorKey: "id", header: () => "ID", footer: (props) => props.column.id },
      // { accessorKey: "tkid", header: () => "TKID", footer: (props) => props.column.id },
      { accessorKey: "sotk", header: () => "SOTK", footer: (props) => props.column.id },
      { accessorKey: "mahq", header: () => "MAHQ", footer: (props) => props.column.id },
      { accessorKey: "trangthaitk", header: () => "Trạng thái TK", footer: (props) => props.column.id },
      { accessorKey: "bpkthsdt", header: () => "BPKTHSDT", footer: (props) => props.column.id },
      { accessorKey: "bptq", header: () => "BPTQ", footer: (props) => props.column.id },
      { accessorKey: "ptvc", header: () => "PTVC", footer: (props) => props.column.id },
      { accessorKey: "malh", header: () => "Mã LH", footer: (props) => props.column.id },
      { accessorKey: "ngayDk", header: () => "Ngày DK", footer: (props) => props.column.id },
      { accessorKey: "hourDk", header: () => "Giờ DK", footer: (props) => props.column.id },
      { accessorKey: "ngayThaydoiDk", header: () => "Ngày Thay Đổi DK", footer: (props) => props.column.id },
      { accessorKey: "hourThaydoiDk", header: () => "Giờ Thay Đổi DK", footer: (props) => props.column.id },
      { accessorKey: "masothueKbhq", header: () => "Mã Số Thuế KBHQ", footer: (props) => props.column.id },
      { accessorKey: "tenDoanhnghiep", header: () => "Tên Doanh Nghiệp", footer: (props) => props.column.id },
      { accessorKey: "sodienthoai", header: () => "Số Điện Thoại", footer: (props) => props.column.id },
      { accessorKey: "tenDoanhnghiepUythac", header: () => "Tên Doanh Nghiệp Ủy Thác", footer: (props) => props.column.id },
      { accessorKey: "tenDoitacnuocngoai", header: () => "Tên Đối Tác Nước Ngoài", footer: (props) => props.column.id },
      { accessorKey: "maquocgiaDoitacnuocngoai", header: () => "Mã Quốc Gia Đối Tác Nước Ngoài", footer: (props) => props.column.id },
      { accessorKey: "vandon01", header: () => "Vận Đơn 01", footer: (props) => props.column.id },
      { accessorKey: "vandon02", header: () => "Vận Đơn 02", footer: (props) => props.column.id },
      { accessorKey: "vandon03", header: () => "Vận Đơn 03", footer: (props) => props.column.id },
      { accessorKey: "vandon04", header: () => "Vận Đơn 04", footer: (props) => props.column.id },
      { accessorKey: "vandon05", header: () => "Vận Đơn 05", footer: (props) => props.column.id },
      { accessorKey: "soluongkienhang", header: () => "Số Lượng Kiện Hàng", footer: (props) => props.column.id, cell: ({ getValue }) => formatNumber(getValue() as number), },
      { accessorKey: "maDvtKienhang", header: () => "Mã ĐVT Kiện Hàng", footer: (props) => props.column.id },
      { accessorKey: "grossweight", header: () => "Trọng Lượng Tổng", footer: (props) => props.column.id, cell: ({ getValue }) => formatNumber(getValue() as number), },
      { accessorKey: "maDvtGw", header: () => "Mã ĐVT GW", footer: (props) => props.column.id },
      { accessorKey: "soluongContainer", header: () => "Số Lượng Container", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number),},
      { accessorKey: "maDiadiemdohang", header: () => "Mã Địa Điểm Đó Hàng", footer: (props) => props.column.id },
      { accessorKey: "maDiadiemxephang", header: () => "Mã Địa Điểm Xếp Hàng", footer: (props) => props.column.id },
      { accessorKey: "tenPhuongtienvanchuyen", header: () => "Tên Phương Tiện Vận Chuyển", footer: (props) => props.column.id },
      { accessorKey: "ngayHangDen", header: () => "Ngày Hàng Đến", footer: (props) => props.column.id },
      { accessorKey: "phuongThucThanhToan", header: () => "Phương Thức Thanh Toán", footer: (props) => props.column.id },
      { accessorKey: "tongTriGiaHoaDon", header: () => "Tổng Trị Giá Hóa Đơn", footer: (props) => props.column.id, cell: ({ getValue }) => formatNumber(getValue() as number),
  
    },
      { accessorKey: "tongTriGiaTinhThue", header: () => "Tổng Trị Giá Tính Thuế", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number), },
      { accessorKey: "tongTienThue", header: () => "Tổng Tiền Thuế", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number), },
      { accessorKey: "tongSoDonghang", header: () => "Tổng Số Dòng Hàng", footer: (props) => props.column.id, cell: ({ getValue }) => formatNumber(getValue() as number), },
      { accessorKey: "ngayCapPhep", header: () => "Ngày Cấp Phép", footer: (props) => props.column.id },
      { accessorKey: "gioCapPhep", header: () => "Giờ Cấp Phép", footer: (props) => props.column.id },
      { accessorKey: "ngayHoanthanhKiemtra", header: () => "Ngày Hoàn Thành Kiểm Tra", footer: (props) => props.column.id },
      { accessorKey: "gioHoanthanhKiemtra", header: () => "Giờ Hoàn Thành Kiểm Tra", footer: (props) => props.column.id },
      { accessorKey: "ngayHuyTk", header: () => "Ngày Hủy TK", footer: (props) => props.column.id },
      { accessorKey: "gioHuyTk", header: () => "Giờ Hủy TK", footer: (props) => props.column.id },
      { accessorKey: "tenNguoiphutrachKiemtrahoso", header: () => "Tên Người Phụ Trách Kiểm Tra Hồ Sơ", footer: (props) => props.column.id },
      { accessorKey: "tenNguoiphutrachKiemhoa", header: () => "Tên Người Phụ Trách Kiểm Hóa", footer: (props) => props.column.id },
      { accessorKey: "hsCode", header: () => "HS Code", footer: (props) => props.column.id },
      { accessorKey: "moTaHangHoa", header: () => "Mô Tả Hàng Hóa", footer: (props) => props.column.id },
      { accessorKey: "soLuongHanghoa", header: () => "Số Lượng Hàng Hóa", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number),},
      { accessorKey: "maDvtHanghoa", header: () => "Mã ĐVT Hàng Hóa", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number),},
      { accessorKey: "triGiaHoaDon", header: () => "Trị Giá Hóa Đơn", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number),},
      { accessorKey: "dongiaHoadon", header: () => "Đơn Giá Hóa Đơn", footer: (props) => props.column.id },
      { accessorKey: "maTienteHoadon", header: () => "Mã Tiền Tệ Hóa Đơn", footer: (props) => props.column.id },
      { accessorKey: "donviDongiaTiente", header: () => "Đơn Vị Đơn Giá Tiền Tệ", footer: (props) => props.column.id },
      { accessorKey: "triGiaTinhThueS", header: () => "Trị Giá Tính Thuế S", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number),},
      { accessorKey: "triGiaTinhThueM", header: () => "Trị Giá Tính Thuế M", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number),},
      { accessorKey: "dongiaTinhthue", header: () => "Đơn Giá Tính Thuế", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number),},
      { accessorKey: "thuesuatNhapkhau", header: () => "Thuế Suất Nhập Khẩu", footer: (props) => props.column.id },
      { accessorKey: "tienThueNhapkhau", header: () => "Tiền Thuế Nhập Khẩu", footer: (props) => props.column.id , cell: ({ getValue }) => formatNumber(getValue() as number),},
      { accessorKey: "xuatxu", header: () => "Xuất Xứ", footer: (props) => props.column.id },
      { accessorKey: "maVanbanphapquy", header: () => "Mã Văn Bản Pháp Quy", footer: (props) => props.column.id },
      { accessorKey: "phanloaiGiayphepNk", header: () => "Phân Loại Giấy Phép NK", footer: (props) => props.column.id },
      { accessorKey: "maBieuthueNk", header: () => "Mã Biểu Thuế NK", footer: (props) => props.column.id },
      { accessorKey: "maMiengiamThue", header: () => "Mã Miễn Giảm Thuế", footer: (props) => props.column.id },
    ],
    []
  );
  


  

  const [data, setData] = React.useState(() => makeData(100));
  const refreshData = () => setData(() => makeData(100));

  const handleData = (data:any) => {
    console.log(data); // "Data from child"
  };


  return (
    <>
      <Header title="Tìm kiếm"></Header>
   
    <br />
      <div>
      {/* <InputForm onSend={handleData}></InputForm> */}
   

      </div>


      <hr />
 

      <MyTableBill
        {...{
          // data,
          columns,
        }}
      />

      <hr />
      {/* <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div> */}
    </>
  );
}
