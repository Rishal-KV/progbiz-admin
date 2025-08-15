import api from "@/lib/axios";

export const getAllFaqs = async () => {
    try {
        const response = await api.get("/faq");
        return response.data;
    } catch (error) {
        throw error;
    }
}
    

export const createFaq = async (data: any) => {
    try {
        const response = await api.post("/faq", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateFaq = async (data: any,id:string) => {
    try {
        const response = await api.put(`/faq/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getFaqById = async (id:string) => {
    try {
        const response = await api.get(`/faq/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const toggleFaqStatus = async (slug:string) => {
    try {
        const response = await api.patch(`/faq/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

