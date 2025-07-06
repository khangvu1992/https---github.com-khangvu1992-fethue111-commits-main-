import { ColumnDef } from "@tanstack/react-table";

function formatNumber(value: any) {
  if (value == null) return "";
  return new Intl.NumberFormat().format(Number(value));
}

export function generateColumnsFromMeta(meta: ColumnMeta[]): ColumnDef<any>[] {
  return meta.map((col) => {
    const key = col.columnName;

    return {
      accessorKey: key,
      header: () => key,
      footer: (props) => props.column.id,
    } satisfies ColumnDef<any>;
  });
}

type ColumnMeta = {
  columnName: string;
  dataType: any;
  characterMaximumLength: number | null;
  isNullable: "YES" | "NO";
};


    //     // { accessorKey: "id", header: () => "ID", footer: (props) => props.column.id },
    //     // { accessorKey: "tkid", header: () => "TKID", footer: (props) => props.column.id },
    //     { accessorKey: "sotk", header: () => "SOTK", footer: (props) => props.column.id },
    //     { accessorKey: "mahq", header: () => "MAHQ", footer: (props) => props.column.id },
    //     { accessorKey: "trangthaitk", header: () => "Trạng thái TK", footer: (props) => props.column.id },
    //     { accessorKey: "bpkthsdt", header: () => "BPKTHSDT", footer: (props) => props.column.id },
    //     { accessorKey: "bptq", header: () => "BPTQ", footer: (props) => props.column.id },

    //   const formatNumber = (number: number) => {
    //     return new Intl.NumberFormat("en-US", {
    //       minimumFractionDigits: 3, // Đảm bảo có 2 chữ số sau dấu phẩy
    //       maximumFractionDigits: 3, // Đảm bảo không có quá 2 chữ số sau dấu phẩy
    //     }).format(number);
    //   };