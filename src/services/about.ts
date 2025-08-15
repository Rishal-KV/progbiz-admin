import api from "@/lib/axios";

export const getAbout = async () => {
    try {
        const response = await api.get("/about");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createAbout = async (data: any) => {
    try {
        const response = await api.post("/about", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const updateAbout = async (data: any,slug:string) => {
    try {
        const response = await api.put(`/about/${slug}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const getAboutById = async (slug: string) => {
    try {
        const response = await api.get(`/about/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const toggleAboutStatus = async (slug:string) => {
    try {
        const response = await api.patch(`/about/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
