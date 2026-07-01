import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);

            // APIResponse wrapper: isSuccess/success, code, message, data
            const isSuccess = response.code === 200 || response.isSuccess || response.success;
            if (isSuccess && response.data) {
                const authData = response.data;
                const userData = {
                    id: authData.userId,
                    fullname: authData.userName,
                    email: authData.userEmail,
                    role: authData.userRole,
                };
                localStorage.setItem("token", authData.token);
                localStorage.setItem("user", JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            } else {
                return { success: false, message: response.message || "Đăng nhập thất bại" };
            }
        } catch (error) {
            const message = error.message || error.response?.data?.message || "Lỗi kết nối máy chủ hoặc thông tin không chính xác";
            return { success: false, message };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
