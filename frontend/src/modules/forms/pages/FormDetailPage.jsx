import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FormBuilder from "../components/FormBuilder";
import FormViewer from "../components/FormViewer";
import formService from "../../../services/formService";
import { useAuth } from "../../../contexts/AuthContext";

export const FormDetailPage = ({ type }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isViewMode = type === "VIEW";
  const isAdmin = user?.role === "ADMIN";

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isViewMode && id) {
      const fetchForm = async () => {
        try {
          setLoading(true);
          const data = await formService.getFormById(id);
          setForm(data.data || data);
        } catch (err) {
          window.toast.error(err.message || "Không thể tải thông tin biểu mẫu.");
          navigate("/");
        } finally {
          setLoading(false);
        }
      };
      fetchForm();
    }
  }, [isViewMode, id, navigate]);

  if (isViewMode) {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground">Đang tải thông tin biểu mẫu...</p>
        </div>
      );
    }
    return (
      <FormViewer
        formId={id}
        title={form?.title}
        description={form?.description}
        fields={form?.fields || []}
        readOnly={isAdmin}
      />
    );
  }

  return <FormBuilder type={type} />;
};

export default FormDetailPage;
