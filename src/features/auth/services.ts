import { apiRequest } from '@/lib/apiRequest';
import { LoginFormData, LoginResponse, RefreshTokenResponse } from "./schema";
import { AxiosError } from "axios";

// Login request
// Note: The backend sets refresh token as an httpOnly cookie automatically
export async function login(credentials: LoginFormData): Promise<LoginResponse> {
    try {
        const response = await apiRequest<LoginResponse>('post', '/auth/web-sign-in', credentials);

        // Store access token in localStorage
        if (response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
            console.log('[Auth] Access token saved to localStorage');
        }

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

// Refresh token request
// Note: The refresh token is sent automatically via httpOnly cookie (withCredentials: true)
export async function refreshAccessToken(): Promise<RefreshTokenResponse | null> {
    try {
        // The refresh token cookie is sent automatically with withCredentials: true
        const response = await apiRequest<RefreshTokenResponse>('post', '/auth/web-refresh', {});

        // Update access token in localStorage
        if (response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
        }

        return response;
    } catch (error) {
        // If refresh fails, clear tokens
        localStorage.removeItem('accessToken');

        if (error instanceof AxiosError) {
            throw new Error(error.response?.data?.message || "Token refresh failed.");
        }
        throw new Error("Token refresh failed.");
    }
}

export async function logout(): Promise<void> {
    // Clear access token from localStorage
    localStorage.removeItem('accessToken');
}
