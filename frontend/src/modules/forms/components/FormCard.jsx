import React from "react";
import { Calendar, ListCollapse, Eye, Edit, Trash2 } from "lucide-react";
import FormStatusBadge from "./FormStatusBadge";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const FormCard = ({ form, onPreview, onEdit, onDelete }) => {
  return (
    <Card className="group relative flex flex-col justify-between border border-border bg-card hover:bg-zinc-50/10 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 rounded-2xl p-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pt-6 px-6">
        <FormStatusBadge status={form.status} />
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{new Date(form.createdAt).toLocaleDateString("vi-VN")}</span>
        </span>
      </CardHeader>
      
      <CardContent className="flex-1 py-2 px-6">
        <CardTitle className="text-lg font-bold text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors font-heading">
          {form.title}
        </CardTitle>
        <p className="text-muted-foreground text-sm line-clamp-2">
          {form.description || "Không có mô tả."}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border pt-4 pb-4 px-6 bg-transparent">
        <span className="text-xs text-muted-foreground flex items-center gap-1.5">
          <ListCollapse className="h-3.5 w-3.5" />
          <span>{form.fields?.length || 0} trường dữ liệu</span>
        </span>
        
        <div className="flex gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPreview?.(form.id)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
            title="Xem trước"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit?.(form.id)}
            className="h-8 w-8 text-muted-foreground hover:text-primary cursor-pointer"
            title="Chỉnh sửa"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete?.(form.id)}
            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 cursor-pointer"
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FormCard;
