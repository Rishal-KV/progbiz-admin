import api from "@/lib/axios";

export const getHero = async () => {
    try {
        const response = await api.get("/hero");
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createHero = async (data: any) => {
    try {
        const response = await api.post("/hero", data);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const updateHero = async (data: any,slug:string) => {
    try {
        const response = await api.put(`/hero/${slug}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getHeroById = async (slug: string) => {
    try {
        const response = await api.get(`/hero/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const toggleHeroStatus = async (slug:string) => {
    try {
        const response = await api.patch(`/hero/${slug}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


