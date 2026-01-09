import axios from "axios";
import router from "../router";

const axiosInst = axios.create({
    baseURL: "http://87.242.102.227:5000/",
    // withCredentials: true,
});

axiosInst.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers?.Authorization) {
        delete config.headers.Authorization;
    }
    return config;
});

axiosInst.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (
            error.response &&
            error.response.status === 401 &&
            router.currentRoute.value.path !== "/auth/login" &&
            router.currentRoute.value.path !== "/auth/reset"
        ) {
            localStorage.removeItem("access_token");
            sessionStorage.removeItem("access_token");
        }
        return Promise.reject(error);
    },
);

export default axiosInst;
