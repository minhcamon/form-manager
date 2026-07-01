import { useEffect, useState } from "react";
import formService from "../../../services/formService";

export const useFormDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const data = await formService.getForms();
      if (Array.isArray(data)) {
        setForms(data);
      } else if (data && (data.code === 200 || data.isSuccess || data.success)) {
        setForms(data.data || []);
      } else {
        window.toast.error("Không thể tải danh sách biểu mẫu.");
      }
    } catch (err) {
      window.toast.error(err.message || "Lỗi kết nối đến máy chủ. Vui lòng kiểm tra lại backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
  }, []);

  const handleCreate = () => {
    console.log("Create new form triggered");
  };

  const handlePreview = (formId) => {
    console.log(`Preview form ${formId} triggered`);
  };

  const handleEdit = (formId) => {
    console.log(`Edit form ${formId} triggered`);
  };

  const handleDelete = (formId) => {
    console.log(`Delete form ${formId} triggered`);
  };

  return {
    forms,
    loading,
    handleCreate,
    handlePreview,
    handleEdit,
    handleDelete,
    refetch: fetchForms,
  };
};
