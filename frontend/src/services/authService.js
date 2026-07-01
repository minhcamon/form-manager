import axiosClient from "../lib/axios";

export const authService = {
    login: async (username, password) => {
        try {
            const response = await axiosClient.post('/auth/login', { username, password });
            return response;
        } catch (error) {
            console.error('Login error at AuthService:', error);
            const errorMsg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại!';
            throw new Error(errorMsg);
        }
    },
};

export default authService;
