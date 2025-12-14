import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// The login response - note: refresh token is set as httpOnly cookie by the backend
export interface LoginResponse {
    accessToken: string;
}

export interface RefreshTokenResponse {
    accessToken: string;
}

