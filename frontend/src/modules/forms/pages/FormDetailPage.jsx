import React from "react";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FormBuilder from "../components/FormBuilder";
import FormViewer from "../components/FormViewer";
import { useFormBuilder } from "../hooks/useFormBuilder";

export const FormDetailPage = ({ type }) => {
  const { id } = useParams();
  const isViewMode = type === "VIEW";

  // Fetch form data for View mode. Builder mode manages its own useFormBuilder instance internally.
  const { title, description, fields, loading } = useFormBuilder(isViewMode ? id : null);

  if (isViewMode) {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Đang tải thông tin biểu mẫu...</p>
        </div>
      );
    }
    return <FormViewer title={title} description={description} fields={fields} />;
  }

  return <FormBuilder type={type} />;
};

export default FormDetailPage;
