import api from '@/lib/axios';
import { AxiosResponse, AxiosError } from 'axios';

export async function apiRequest<T>(method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string, data?: unknown): Promise<T> {
    try {
        const config: { method: string; url: string; data?: unknown; headers?: Record<string, string> } = {
            method,
            url,
            data,
        };

        // If data is FormData, explicitly unset Content-Type to override axios default 'application/json'
        // This lets the browser set correct multipart/form-data with boundary
        if (data instanceof FormData) {
            config.headers = {
                'Content-Type': undefined as unknown as string,
            };
        }

        const res = await api.request<unknown>(config) as AxiosResponse<unknown>;

        const body = res.data;

        // If the API wraps responses in { status, message, data }
        if (body && typeof body === 'object' && 'data' in (body as Record<string, unknown>)) {
            const wrapped = body as { data?: unknown };
            return (wrapped.data ?? (res.data as unknown)) as T;
        }

        return res.data as T;
    } catch (err: unknown) {
        throw err;
    }
}
