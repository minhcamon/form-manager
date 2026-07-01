import axiosClient from "../lib/axios";

export const formService = {
    getForms: async () => {
        try {
            const response = await axiosClient.get("/api/forms");
            return response.data;
        } catch (error) {
            console.error("Get forms error at FormService:", error);
            const errorMsg = error.response?.data?.message || "Không thể tải danh sách biểu mẫu. Vui lòng thử lại!";
            throw new Error(errorMsg);
        }
    },
};

export default formService;
