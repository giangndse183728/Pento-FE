import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
    baseURL:
        process.env.NEXT_PUBLIC_APP_API_URL ||
        "https://pento-api.jollyground-f3462e5a.southeastasia.azurecontainerapps.io",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});


interface FailedQueueItem {
    resolve: (value: AxiosResponse) => void;
    reject: (err: unknown) => void;
}

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: unknown, success = false, response?: AxiosResponse) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (success && response) resolve(response);
        else reject(error);
    });
    failedQueue = [];
};


api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (
            (error.response?.status === 401 || error.response?.status === 403) &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise<AxiosResponse>((resolve, reject) => {
                    failedQueue.push({
                        resolve: (res) => resolve(res),
                        reject: (err) => reject(err),
                    });
                });
            }

            isRefreshing = true;

            try {
                const refreshResponse = await axios.post(
                    `${process.env.NEXT_PUBLIC_APP_API_URL ||
                    "https://pento-api.jollyground-f3462e5a.southeastasia.azurecontainerapps.io"
                    }/users/web-refresh`,
                    {},
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );

                if (refreshResponse.status === 200) {
                    processQueue(null, true, refreshResponse);
                    return api(originalRequest);
                }

                throw new Error("Token refresh failed");
            } catch (err) {
                processQueue(err, false);

                try {
                    await axios.post(
                        `${process.env.NEXT_PUBLIC_APP_API_URL ||
                        "https://pento-api.jollyground-f3462e5a.southeastasia.azurecontainerapps.io"
                        }/users/sign-out`,
                        {},
                        { withCredentials: true }
                    );
                } catch {
                    /* ignore logout errors */
                }

                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;

export type ApiResponse<T> = {
    status: string;
    message: string;
    data: T;
};
