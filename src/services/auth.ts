import api from "@/lib/axios";


export const login = async (data: any) => {
    try {
        const response = await api.post("/auth/login", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
