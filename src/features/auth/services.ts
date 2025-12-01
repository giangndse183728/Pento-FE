import { apiRequest } from '@/lib/apiRequest';
import { LoginFormData, LoginResponse } from "./schema";
import { AxiosError } from "axios";

// Login request
export async function login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
        const response = await apiRequest<LoginResponse>('post', '/auth/web-sign-in', credentials);
        return response;
    } catch (error) {
        if (error instanceof AxiosError) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
        }
        throw new Error("Login failed. Please try again.");
    }
}

// Logout request
export async function logout(): Promise<void> {
    try {
        await apiRequest('post', '/auth/sign-out');
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Logout failed. Please try again.");
        }
        throw new Error("Logout failed. Please try again.");
    }
}
