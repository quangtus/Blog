/**
 * AdminRoute Component - Bảo vệ routes dành cho Admin
 * 
 * IPO Analysis:
 * - INPUT: children (component con), user từ AuthContext
 * - PROCESS: Kiểm tra isAdmin
 * - OUTPUT: Render children hoặc redirect/thông báo lỗi
 */
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, loading, isAuthenticated, isAdmin } = useAuth();

    // Đang load - hiển thị loading
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Chưa đăng nhập - redirect về login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Không phải admin - hiển thị thông báo lỗi
    if (!isAdmin) {
        return (
            <div className="max-w-2xl mx-auto mt-20 p-8 bg-red-50 rounded-lg border border-red-200">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-red-600 mb-2">
                        Không có quyền truy cập
                    </h1>
                    <p className="text-gray-600 mb-4">
                        Trang này chỉ dành cho Admin. Vui lòng liên hệ quản trị viên nếu bạn cần quyền truy cập.
                    </p>
                    <a
                        href="/"
                        className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Về trang chủ
                    </a>
                </div>
            </div>
        );
    }

    // Là admin - render children
    return children;
};

export default AdminRoute;
