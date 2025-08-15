import api from "@/lib/axios";

export const getTestimonials = async () => {
    try {
        const response = await api.get("/testimonial");
        return response.data;
    } catch (error) {
        throw error;
    }
}
    
export const createTestimonial = async (data: any) => {
    try {
        const response = await api.post("/testimonial", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
    

export const updateTestimonial = async (data: any,id:string) => {
    try {
        const response = await api.put(`/testimonial/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const getTestimonialById = async (id : string) => {
    try {
        const response = await api.get(`/testimonial/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const toggleTestimonialStatus = async (id:string) => {
    try {
        const response = await api.patch(`/testimonial/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


