import { createContext, useState, useContext, useEffect } from 'react';
import axios from '../config/axios';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Session-based auth: Chỉ cần gọi API /me để kiểm tra session
        // Cookie được trình duyệt tự động gửi kèm
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/me');
            setUser(response.data);
        } catch (error) {
            // Session hết hạn hoặc chưa đăng nhập - không cần xử lý gì thêm
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // Session-based: Server trả về user và set Cookie tự động
        const response = await axios.post('/api/login', { email, password });
        const { user } = response.data;
        setUser(user);
        return user;
    };

    const register = async (name, email, password, password_confirmation) => {
        // Session-based: Server trả về user và set Cookie tự động
        const response = await axios.post('/api/register', {
            name,
            email,
            password,
            password_confirmation,
        });
        const { user } = response.data;
        setUser(user);
        return user;
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

