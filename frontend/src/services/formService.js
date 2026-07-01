import axiosClient from "../lib/axios";

export const formService = {
    getForms: async () => {
        try {
            const response = await axiosClient.get("/forms");
            return response.data;
        } catch (error) {
            console.error("Get forms error at FormService:", error);
            const errorMsg = error.response?.data?.message || "Không thể tải danh sách biểu mẫu. Vui lòng thử lại!";
            throw new Error(errorMsg);
        }
    },
    getFormById: async (id) => {
        try {
            const response = await axiosClient.get(`/forms/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Get form ${id} error at FormService:`, error);
            const errorMsg = error.response?.data?.message || "Không thể tải chi tiết biểu mẫu. Vui lòng thử lại!";
            throw new Error(errorMsg);
        }
    },
    createForm: async (request) => {
        try {
            const response = await axiosClient.post("/forms", request);
            return response.data;
        } catch (error) {
            console.error("Create form error at FormService:", error);
            const errorMsg = error.response?.data?.message || "Không thể tạo biểu mẫu. Vui lòng thử lại!";
            throw new Error(errorMsg);
        }
    },
    updateForm: async (id, request) => {
        try {
            const response = await axiosClient.put(`/forms/${id}`, request);
            return response.data;
        } catch (error) {
            console.error(`Update form ${id} error at FormService:`, error);
            const errorMsg = error.response?.data?.message || "Không thể cập nhật biểu mẫu. Vui lòng thử lại!";
            throw new Error(errorMsg);
        }
    },
    deleteForm: async (id) => {
        try {
            const response = await axiosClient.delete(`/forms/${id}`);
            return response;
        } catch (error) {
            console.error(`Delete form ${id} error at FormService:`, error);
            const errorMsg = error.response?.data?.message || "Không thể xóa biểu mẫu. Vui lòng thử lại!";
            throw new Error(errorMsg);
        }
    },
};

export default formService;
