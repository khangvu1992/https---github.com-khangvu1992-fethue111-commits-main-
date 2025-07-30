import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface DialogShowTableProps {
  data: any[];
  dialogTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DialogShowTable({
  data,
  dialogTitle,
  open,
  onOpenChange,
}: DialogShowTableProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[400px] overflow-y-auto border p-2 text-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                {Object.keys(data?.[0] || {}).map((key) => (
                  <th key={key} className="border p-1 bg-gray-100">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.map((item, idx) => (
                <tr key={idx}>
                  {Object.values(item).map((value, i) => (
                    <td key={i} className="border p-1">
                      {typeof value === "boolean"
                        ? value
                          ? "✅ Có"
                          : "❌ Không"
                        : String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
