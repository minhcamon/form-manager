import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import formService from "../../../services/formService";

export const useFormDashboard = () => {
  const navigate = useNavigate();
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
    navigate("/forms/create");
  };

  const handlePreview = (formId) => {
    navigate(`/forms/preview/${formId}`);
  };

  const handleEdit = (formId) => {
    navigate(`/forms/edit/${formId}`);
  };

  const handleDelete = async (formId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa biểu mẫu này không? Hành động này không thể hoàn tác.")) {
      try {
        await formService.deleteForm(formId);
        window.toast.success("Xóa biểu mẫu thành công!");
        fetchForms();
      } catch (err) {
        window.toast.error(err.message || "Không thể xóa biểu mẫu.");
      }
    }
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
