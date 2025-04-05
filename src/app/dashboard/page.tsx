"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import { useSelector } from "react-redux";

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
import MyTable from "@/components/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function dashboard() {
  const rerender = React.useReducer(() => ({}), {})[1];




  const dataFromChild = useSelector((state: any) => state.data.dataFromChild);

  // const columns = React.useMemo<ColumnDef<any>[]>(
  //   () => [
  //     {
  //       accessorKey: "firstName",
  //       cell: (info) => info.getValue(),
  //       footer: (props) => props.column.id,
  //     },
  //     {
  //       accessorFn: (row) => row.lastName,
  //       id: "lastName",
  //       cell: (info) => info.getValue(),
  //       header: () => <span>Last Name</span>,
  //       footer: (props) => props.column.id,
  //     },
  //     {
  //       accessorKey: "age",
  //       header: () => "Age",
  //       footer: (props) => props.column.id,
  //     },
  //     {
  //       accessorKey: "visits",
  //       header: () => <span>Visits</span>,
  //       footer: (props) => props.column.id,
  //     },
  //     {
  //       accessorKey: "status",
  //       header: "Status",
  //       footer: (props) => props.column.id,
  //     },
  //     {
  //       accessorKey: "progress",
  //       header: "Profile Progress",
  //       footer: (props) => props.column.id,
  //     },
  //   ],
  //   []
  // );


  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "id", // id
        header: () => "ID",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "trangthaitk", // trangthaitk
        header: () => "Trạng thái TK",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "bpkthsdt", // bpkthsdt
        header: () => "BPKTHSDT",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "bptq", // bptq
        header: () => "BPTQ",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "ptvc", // ptvc
        header: () => "PTVC",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "malh", // malh
        header: () => "Mã LH",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "ngayDk", // ngayDk
        header: () => "Ngày DK",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "hourDk", // hourDk
        header: () => "Giờ DK",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "ngayThaydoiDk", // ngayThaydoiDk
        header: () => "Ngày Thay Đổi DK",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "hourThaydoiDk", // hourThaydoiDk
        header: () => "Giờ Thay Đổi DK",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "tenDoanhnghiep", // tenDoanhnghiep
        header: () => "Tên Doanh Nghiệp",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "sodienthoai", // sodienthoai
        header: () => "Số Điện Thoại",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "tenDoitacnuocngoai", // tenDoitacnuocngoai
        header: () => "Tên Đối Tác Nước Ngoài",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "vandon01", // vandon01
        header: () => "Vận Đơn 01",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "soluongkienhang", // soluongkienhang
        header: () => "Số Lượng Kiện Hàng",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "grossweight", // grossweight
        header: () => "Trọng Lượng Tổng",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "maDiadiemdohang", // maDiadiemdohang
        header: () => "Mã Địa Điểm Đó Hàng",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "maDiadiemxephang", // maDiadiemxephang
        header: () => "Mã Địa Điểm Xếp Hàng",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "tenPhuongtienvanchuyen", // tenPhuongtienvanchuyen
        header: () => "Tên Phương Tiện Vận Chuyển",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "ngayHangDen", // ngayHangDen
        header: () => "Ngày Hàng Đến",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "tongTriGiaHoaDon", // tongTriGiaHoaDon
        header: () => "Tổng Trị Giá Hóa Đơn",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "tongTriGiaTinhThue", // tongTriGiaTinhThue
        header: () => "Tổng Trị Giá Tính Thuế",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "hsCode", // hsCode
        header: () => "HS Code",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "moTaHangHoa", // moTaHangHoa
        header: () => "Mô Tả Hàng Hóa",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "soLuongHanghoa", // soLuongHanghoa
        header: () => "Số Lượng Hàng Hóa",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "triGiaHoaDon", // triGiaHoaDon
        header: () => "Trị Giá Hóa Đơn",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "dongiaHoadon", // dongiaHoadon
        header: () => "Đơn Giá Hóa Đơn",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "maTienteHoadon", // maTienteHoadon
        header: () => "Mã Tiền Tệ Hóa Đơn",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "xuatxu", // xuatxu
        header: () => "Xuất Xứ",
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "maVanbanphapquy", // maVanbanphapquy
        header: () => "Mã Văn Bản Pháp Quy",
        footer: (props) => props.column.id,
      },
    ],
    []
  );
  




  const [data, setData] = React.useState(() => makeData(100));
  const refreshData = () => setData(() => makeData(100));
  console.log("dataFromChild", dataFromChild);

  return (
    <>
      <Header title="bang du lieu"></Header>
      {dataFromChild}9999999999999999999999999999999999999

      <MyTable
        {...{
          // data,
          columns,
        }}
      />

      <hr />
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <div>
        <button onClick={() => refreshData()}>Refresh Data</button>
      </div>
    </>
  );
}
