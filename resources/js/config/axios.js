import axios from 'axios';

// Cấu hình base URL cho axios
axios.defaults.baseURL =
    import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// QUAN TRỌNG: Bật credentials để gửi Cookie tự động (Session-based auth)
axios.defaults.withCredentials = true;

// Thêm interceptor để xử lý lỗi
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        // Không redirect nếu đang gọi /api/me (check auth) hoặc /api/login, /api/register
        const url = error.config && error.config.url;
        const isAuthEndpoint = url && (
            url.includes('/api/me') ||
            url.includes('/api/login') ||
            url.includes('/api/register')
        );

        if (error.response && error.response.status === 401 && !isAuthEndpoint) {
            // Unauthorized - redirect về login (chỉ khi không phải auth endpoint)
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axios;