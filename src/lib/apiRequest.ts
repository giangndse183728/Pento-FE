import api from '@/lib/axios';
import { AxiosResponse, AxiosError } from 'axios';

export async function apiRequest<T>(method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string, data?: unknown): Promise<T> {
    try {
        const config: { method: string; url: string; data?: unknown; headers?: Record<string, string> } = {
            method,
            url,
            data,
        };

        // If data is FormData, remove Content-Type header to let browser set it with boundary
        if (data instanceof FormData) {
            config.headers = {
                'Content-Type': 'multipart/form-data',
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
