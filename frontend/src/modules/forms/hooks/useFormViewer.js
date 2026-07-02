import { useState } from "react";
import { useNavigate } from "react-router-dom";
import formService from "../../../services/formService";

export const useFormViewer = (formId) => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswerChange = (fieldName, value) => {
    setAnswers((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleCheckboxChange = (fieldName, option, checked) => {
    setAnswers((prev) => {
      const current = prev[fieldName] || [];
      const updated = checked 
        ? [...current, option] 
        : current.filter((item) => item !== option);
      return { ...prev, [fieldName]: updated };
    });
  };

  const handleSubmitResponse = async (fields, onSuccess) => {
    // 1. Validate required fields
    for (const field of fields) {
      if (field.required) {
        const val = answers[field.name];
        const isEmpty = val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0);
        if (isEmpty) {
          window.toast.error(`Vui lòng điền trường bắt buộc: "${field.label}"`);
          return false;
        }
      }
    }

    // 2. Validate format of filled fields
    for (const field of fields) {
      const val = answers[field.name];
      if (val !== undefined && val !== null && val !== "") {
        const valStr = String(val).trim();
        if (field.type === "NUMBER") {
          if (isNaN(Number(valStr))) {
            window.toast.error(`Trường "${field.label}" phải là một số hợp lệ.`);
            return false;
          }
        } else if (field.type === "COLOR") {
          if (!/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(valStr)) {
            window.toast.error(`Trường "${field.label}" phải là mã màu HEX hợp lệ (ví dụ: #FF0000).`);
            return false;
          }
        } else if (field.type === "DATE") {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(valStr)) {
            window.toast.error(`Trường "${field.label}" phải là ngày hợp lệ (định dạng YYYY-MM-DD).`);
            return false;
          }
        } else if (field.type === "SELECT") {
          let options = [];
          try {
            options = JSON.parse(field.optionsJson || "[]");
          } catch(e) {}
          if (options.length > 0 && !options.includes(valStr)) {
            window.toast.error(`Trường "${field.label}" chứa giá trị lựa chọn không hợp lệ.`);
            return false;
          }
        }
      }
    }

    // 3. Map answers to backend format
    const submissionValues = [];
    for (const field of fields) {
      const val = answers[field.name];
      if (val !== undefined && val !== null && val !== "") {
        let stringValue = "";
        if (Array.isArray(val)) {
          stringValue = JSON.stringify(val);
        } else if (typeof val === "boolean") {
          stringValue = val ? "true" : "false";
        } else {
          stringValue = String(val).trim();
        }
        submissionValues.push({
          fieldId: field.id,
          value: stringValue
        });
      }
    }

    try {
      setIsSubmitting(true);
      await formService.submitForm(formId, { values: submissionValues });
      window.toast.success("Gửi câu trả lời biểu mẫu thành công!");
      setAnswers({});
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      window.toast.error(err.message || "Không thể gửi câu trả lời.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    answers,
    isSubmitting,
    handleAnswerChange,
    handleCheckboxChange,
    handleSubmitResponse,
  };
};

export default useFormViewer;
