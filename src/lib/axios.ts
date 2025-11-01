import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_APP_API_URL || "https://pento-api.jollyground-f3462e5a.southeastasia.azurecontainerapps.io",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;