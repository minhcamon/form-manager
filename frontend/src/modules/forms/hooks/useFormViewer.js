import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useFormViewer = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

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

  const handleSubmitResponse = (fields, onSuccess) => {
    // Validate required fields
    for (const field of fields) {
      if (field.required) {
        const val = answers[field.name];
        const isEmpty = !val || (Array.isArray(val) && val.length === 0);
        if (isEmpty) {
          window.toast.error(`Vui lòng điền trường bắt buộc: "${field.label}"`);
          return false;
        }
      }
    }

    window.toast.success("Gửi câu trả lời biểu mẫu thành công!");
    setAnswers({});
    if (onSuccess) onSuccess();
    return true;
  };

  return {
    answers,
    handleAnswerChange,
    handleCheckboxChange,
    handleSubmitResponse,
  };
};

export default useFormViewer;
