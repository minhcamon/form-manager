import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    
    if (!email || !password) {
      window.toast.error("Vui lòng điền đầy đủ email và mật khẩu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        window.toast.success("Đăng nhập thành công!");
        navigate("/", { replace: true });
      } else {
        window.toast.error(result.message || "Tài khoản hoặc mật khẩu không đúng.");
      }
    } catch (err) {
      window.toast.error("Có lỗi kết nối xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    handleSubmit,
  };
};

export default useLogin;
