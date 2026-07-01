import React from "react";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";

export const FormStatusBadge = ({ status }) => {
  switch (status) {
    case "PUBLISHED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
          <CheckCircle2 className="h-3 w-3" />
          <span>Công khai</span>
        </span>
      );
    case "DRAFT":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/60">
          <Clock className="h-3 w-3" />
          <span>Bản nháp</span>
        </span>
      );
    case "CLOSED":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 border border-red-200/60">
          <AlertTriangle className="h-3 w-3" />
          <span>Đóng</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-zinc-50 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 border border-zinc-200/60">
          <span>{status}</span>
        </span>
      );
  }
};

export default FormStatusBadge;
