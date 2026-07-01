import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import formService from "../../../services/formService";

export const useFormBuilder = (formId = null) => {
  const navigate = useNavigate();
  
  // Form Header settings
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [allowMultipleSubmission, setAllowMultipleSubmission] = useState(true);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [fields, setFields] = useState([]);
  
  // Loading and action states
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Active field being edited (Google Forms style)
  const [activeFieldIndex, setActiveFieldIndex] = useState(-1);

  // Fetch form data if in edit mode
  useEffect(() => {
    if (!formId) {
      // For new forms, start with one default text question
      setFields([
        {
          label: "Câu hỏi không có tiêu đề",
          name: "cauHoi1",
          type: "TEXT",
          required: false,
          placeholder: "",
          optionsJson: "[]",
          validationJson: "{}",
          displayOrder: 1
        }
      ]);
      setActiveFieldIndex(0);
      return;
    }

    const fetchFormDetails = async () => {
      try {
        setLoading(true);
        const data = await formService.getFormById(formId);
        if (data) {
          setTitle(data.title || "");
          setDescription(data.description || "");
          setStatus(data.status || "DRAFT");
          setAllowMultipleSubmission(data.allowMultipleSubmission !== false);
          setStartAt(data.startAt ? data.startAt.substring(0, 16) : "");
          setEndAt(data.endAt ? data.endAt.substring(0, 16) : "");
          setFields(data.fields || []);
          if (data.fields && data.fields.length > 0) {
            setActiveFieldIndex(0);
          }
        }
      } catch (err) {
        window.toast.error(err.message || "Không thể tải thông tin biểu mẫu.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchFormDetails();
  }, [formId, navigate]);

  // Helper to convert label to camelCase alphanumeric name
  const convertToCamelCase = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // remove accents
      .replace(/[^a-zA-Z0-9 ]/g, "") // remove special chars
      .split(" ")
      .filter(Boolean)
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join("");
  };

  // Add a new question/field (Google Forms style)
  const handleAddField = () => {
    const newIndex = fields.length;
    const newField = {
      label: "Câu hỏi không có tiêu đề",
      name: `cauHoi${newIndex + 1}`,
      type: "TEXT",
      required: false,
      placeholder: "",
      optionsJson: "[]",
      validationJson: "{}",
      displayOrder: newIndex + 1
    };
    setFields((prev) => [...prev, newField]);
    setActiveFieldIndex(newIndex);
  };

  // Update specific field properties inline
  const handleUpdateField = (index, updatedField) => {
    setFields((prev) => {
      const updated = [...prev];
      const merged = { ...updated[index], ...updatedField };
      
      // If the label is changed, auto-generate a valid camelCase name
      if (updatedField.label !== undefined) {
        const generatedName = convertToCamelCase(updatedField.label);
        merged.name = generatedName || `field_${Date.now()}`;
      }
      
      updated[index] = merged;
      return updated;
    });
  };

  // Duplicate field
  const handleDuplicateField = (index) => {
    const source = fields[index];
    const duplicated = {
      ...source,
      name: `field_${Date.now()}`,
      displayOrder: index + 2
    };

    setFields((prev) => {
      const updated = [...prev];
      updated.splice(index + 1, 0, duplicated);
      // Re-map display orders
      return updated.map((field, idx) => ({
        ...field,
        displayOrder: idx + 1
      }));
    });
    setActiveFieldIndex(index + 1);
    window.toast.success("Đã nhân bản câu hỏi.");
  };

  // Delete field
  const handleDeleteField = (index) => {
    if (fields.length <= 1) {
      window.toast.error("Biểu mẫu cần phải có ít nhất một câu hỏi.");
      return;
    }

    setFields((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((field, idx) => ({
        ...field,
        displayOrder: idx + 1
      }));
    });

    // Fix active focus
    if (activeFieldIndex === index) {
      setActiveFieldIndex(index > 0 ? index - 1 : 0);
    } else if (activeFieldIndex > index) {
      setActiveFieldIndex(activeFieldIndex - 1);
    }
    window.toast.success("Đã xóa câu hỏi.");
  };

  // Reorder fields
  const handleMoveField = (index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === fields.length - 1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    setFields((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      
      return updated.map((field, idx) => ({
        ...field,
        displayOrder: idx + 1
      }));
    });
    setActiveFieldIndex(targetIndex);
  };

  // Submit form (Create or Update)
  const handleSaveForm = async () => {
    if (!title.trim()) {
      window.toast.error("Vui lòng nhập tiêu đề biểu mẫu.");
      return;
    }
    if (fields.length === 0) {
      window.toast.error("Biểu mẫu cần có ít nhất một câu hỏi.");
      return;
    }

    // Validate fields names
    for (let i = 0; i < fields.length; i++) {
      if (!fields[i].label.trim()) {
        window.toast.error(`Câu hỏi số ${i + 1} chưa có nội dung nhãn.`);
        setActiveFieldIndex(i);
        return;
      }
      // Ensure option type fields have options
      const isOptionType = ["SELECT", "RADIO", "CHECKBOX", "MULTI_SELECT"].includes(fields[i].type);
      if (isOptionType) {
        try {
          const opts = JSON.parse(fields[i].optionsJson || "[]");
          if (!Array.isArray(opts) || opts.length === 0) {
            window.toast.error(`Câu hỏi số ${i + 1} cần có ít nhất một tùy chọn.`);
            setActiveFieldIndex(i);
            return;
          }
        } catch (e) {
          window.toast.error(`Câu hỏi số ${i + 1} cấu trúc tùy chọn bị lỗi.`);
          setActiveFieldIndex(i);
          return;
        }
      }
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      allowMultipleSubmission,
      startAt: startAt ? `${startAt}:00` : null,
      endAt: endAt ? `${endAt}:00` : null,
      fields
    };

    try {
      setIsSaving(true);
      if (formId) {
        await formService.updateForm(formId, payload);
        window.toast.success("Đã cập nhật biểu mẫu thành công!");
      } else {
        await formService.createForm(payload);
        window.toast.success("Đã tạo biểu mẫu mới thành công!");
      }
      navigate("/");
    } catch (err) {
      window.toast.error(err.message || "Lỗi khi lưu biểu mẫu.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    status,
    setStatus,
    allowMultipleSubmission,
    setAllowMultipleSubmission,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    fields,
    loading,
    isSaving,
    activeFieldIndex,
    setActiveFieldIndex,
    handleAddField,
    handleUpdateField,
    handleDuplicateField,
    handleDeleteField,
    handleMoveField,
    handleSaveForm,
  };
};

export default useFormBuilder;
