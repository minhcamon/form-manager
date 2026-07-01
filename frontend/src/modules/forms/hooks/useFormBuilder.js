import { useState, useEffect, useRef } from "react";
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
  const [activeFieldIndex, setActiveFieldIndex] = useState(-1);

  // Prevent multiple creations in CREATE mode
  const creationStarted = useRef(false);

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

  useEffect(() => {
    // 1. CREATE MODE: Create a default draft form first, then redirect to edit mode
    if (!formId) {
      if (creationStarted.current) return;
      creationStarted.current = true;

      const createDraftForm = async () => {
        try {
          setLoading(true);
          const initialForm = await formService.createForm({
            title: "Biểu mẫu chưa có tiêu đề",
            description: "",
            status: "DRAFT",
            allowMultipleSubmission: true
          });
          const form = initialForm.data || initialForm;
          
          // Create the first default question for this form
          await formService.createField(form.id, {
            label: "Câu hỏi không có tiêu đề",
            name: "cauHoi1",
            type: "TEXT",
            required: false,
            placeholder: "",
            optionsJson: "[]",
            validationJson: "{}",
            displayOrder: 1
          });

          // Navigate to the edit view for the created form
          navigate(`/forms/edit/${form.id}`, { replace: true });
        } catch (err) {
          window.toast.error(err.message || "Không thể khởi tạo biểu mẫu mới.");
          navigate("/");
        } finally {
          setLoading(false);
        }
      };

      createDraftForm();
      return;
    }

    // 2. EDIT MODE: Load form data and fields
    const fetchFormDetails = async () => {
      try {
        setLoading(true);
        const data = await formService.getFormById(formId);
        const form = data.data || data;
        if (form) {
          setTitle(form.title || "");
          setDescription(form.description || "");
          setStatus(form.status || "DRAFT");
          setAllowMultipleSubmission(form.allowMultipleSubmission !== false);
          setStartAt(form.startAt ? form.startAt.substring(0, 16) : "");
          setEndAt(form.endAt ? form.endAt.substring(0, 16) : "");
          setFields(form.fields || []);
          if (form.fields && form.fields.length > 0) {
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

  // Add a new question (Direct API call, single operation)
  const handleAddField = async () => {
    if (!formId) return;
    try {
      const newIndex = fields.length;
      const newFieldPayload = {
        label: "Câu hỏi không có tiêu đề",
        name: `cauHoi${newIndex + 1}`,
        type: "TEXT",
        required: false,
        placeholder: "",
        optionsJson: "[]",
        validationJson: "{}",
        displayOrder: newIndex + 1
      };
      
      const data = await formService.createField(formId, newFieldPayload);
      const createdField = data.data || data;
      setFields((prev) => [...prev, createdField]);
      setActiveFieldIndex(newIndex);
      window.toast.success("Đã thêm câu hỏi mới.");
    } catch (err) {
      window.toast.error(err.message || "Không thể thêm câu hỏi.");
    }
  };

  // Update specific field properties (Updates local state, saves if requested)
  const handleUpdateField = (index, updatedProperties, shouldSaveImmediately = false) => {
    setFields((prev) => {
      const updated = [...prev];
      const merged = { ...updated[index], ...updatedProperties };
      
      if (updatedProperties.label !== undefined) {
        merged.name = convertToCamelCase(updatedProperties.label) || `field_${Date.now()}`;
      }
      
      updated[index] = merged;
      
      if (shouldSaveImmediately && merged.id) {
        formService.updateField(formId, merged.id, {
          label: merged.label,
          name: merged.name,
          type: merged.type,
          required: merged.required,
          displayOrder: merged.displayOrder,
          placeholder: merged.placeholder,
          optionsJson: merged.optionsJson,
          validationJson: merged.validationJson
        }).catch((err) => {
          console.error("Auto save field error:", err);
        });
      }
      
      return updated;
    });
  };

  // Triggered on input blur to save text edits to the backend (single operation)
  const handleSaveField = async (index) => {
    const field = fields[index];
    if (!field || !field.id) return;
    try {
      await formService.updateField(formId, field.id, {
        label: field.label,
        name: field.name,
        type: field.type,
        required: field.required,
        displayOrder: field.displayOrder,
        placeholder: field.placeholder,
        optionsJson: field.optionsJson,
        validationJson: field.validationJson
      });
    } catch (err) {
      window.toast.error(err.message || "Lỗi khi lưu câu hỏi.");
    }
  };

  // Duplicate field (Direct API call, single operation, no complex reorders in DB)
  const handleDuplicateField = async (index) => {
    const source = fields[index];
    if (!source || !formId) return;
    try {
      const duplicatedPayload = {
        label: `${source.label} (Bản sao)`,
        name: `field_${Date.now()}`,
        type: source.type,
        required: source.required,
        placeholder: source.placeholder,
        optionsJson: source.optionsJson,
        validationJson: source.validationJson,
        displayOrder: index + 2
      };

      const data = await formService.createField(formId, duplicatedPayload);
      const createdField = data.data || data;

      setFields((prev) => {
        const updated = [...prev];
        updated.splice(index + 1, 0, createdField);
        return updated;
      });
      
      setActiveFieldIndex(index + 1);
      window.toast.success("Đã nhân bản câu hỏi.");
    } catch (err) {
      window.toast.error(err.message || "Không thể nhân bản câu hỏi.");
    }
  };

  // Delete field (Direct API call, single operation, no complex reorders in DB)
  const handleDeleteField = async (index) => {
    if (fields.length <= 1) {
      window.toast.error("Biểu mẫu cần phải có ít nhất một câu hỏi.");
      return;
    }
    const field = fields[index];
    if (!field || !field.id || !formId) return;

    try {
      await formService.deleteField(formId, field.id);
      
      setFields((prev) => prev.filter((_, i) => i !== index));

      if (activeFieldIndex === index) {
        setActiveFieldIndex(index > 0 ? index - 1 : 0);
      } else if (activeFieldIndex > index) {
        setActiveFieldIndex(activeFieldIndex - 1);
      }
      window.toast.success("Đã xóa câu hỏi.");
    } catch (err) {
      window.toast.error(err.message || "Không thể xóa câu hỏi.");
    }
  };

  // Save form header details
  const handleSaveForm = async () => {
    if (!title.trim()) {
      window.toast.error("Vui lòng nhập tiêu đề biểu mẫu.");
      return;
    }
    if (!formId) return;

    const payload = {
      title: title.trim(),
      description: description.trim(),
      status,
      allowMultipleSubmission,
      startAt: startAt ? `${startAt}:00` : null,
      endAt: endAt ? `${endAt}:00` : null
    };

    try {
      setIsSaving(true);
      await formService.updateForm(formId, payload);
      window.toast.success("Đã lưu biểu mẫu thành công!");
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
    handleSaveField,
    handleDuplicateField,
    handleDeleteField,
    handleSaveForm,
  };
};

export default useFormBuilder;
