import api from "@/lib/axios";
import { LoginFormData, LoginResponse } from "./schema";
import { AxiosError } from "axios";

// Login request
export async function login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
        const response = await api.post<LoginResponse>("/users/web-sign-in", credentials);
        return response.data;
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
        await api.post("/users/sign-out");
    } catch (error) {
        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Logout failed. Please try again.");
        }
        throw new Error("Logout failed. Please try again.");
    }
}
