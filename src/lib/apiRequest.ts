import api from '@/lib/axios';
import { AxiosResponse, AxiosError } from 'axios';

export async function apiRequest<T>(method: 'get' | 'post' | 'put' | 'delete', url: string, data?: unknown): Promise<T> {
    console.log(`🌐 API Request: ${method.toUpperCase()} ${url}`, data ? { data } : '');

    try {
        const res = await api.request<unknown>({ method, url, data }) as AxiosResponse<unknown>;

        console.log(`✅ API Response: ${method.toUpperCase()} ${url}`, { status: res.status, data: res.data });

        const body = res.data;

        // If the API wraps responses in { status, message, data }
        if (body && typeof body === 'object' && 'data' in (body as Record<string, unknown>)) {
            const wrapped = body as { data?: unknown };
            return (wrapped.data ?? (res.data as unknown)) as T;
        }

        return res.data as T;
    } catch (err: unknown) {
        const axiosErr = err as AxiosError | unknown;
        const status = (axiosErr as AxiosError)?.response?.status;
        const respData = (axiosErr as AxiosError)?.response?.data ?? axiosErr;
        console.error(`❌ API ${method.toUpperCase()} ${url} failed:`, status, respData);
        throw err;
    }
}
