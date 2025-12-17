import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const Layout = ({ children }) => {
    const { user, logout, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex items-center px-2 py-2 text-xl font-bold text-gray-800">
                                📝 My Blog
                            </Link>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                                >
                                    🏠 Home
                                </Link>
                                {isAuthenticated && (
                                    <Link
                                        to="/posts/create"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
                                    >
                                        ✏️ Viết bài
                                    </Link>
                                )}
                                
                                {/* Admin Menu */}
                                {isAdmin && (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                                            className="inline-flex items-center px-1 pt-1 text-sm font-medium text-purple-600 hover:text-purple-800"
                                        >
                                            ⚙️ Admin ▼
                                        </button>
                                        
                                        {isAdminMenuOpen && (
                                            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                                <div className="py-1">
                                                    <Link
                                                        to="/admin"
                                                        onClick={() => setIsAdminMenuOpen(false)}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        📊 Dashboard
                                                    </Link>
                                                    <Link
                                                        to="/admin/categories"
                                                        onClick={() => setIsAdminMenuOpen(false)}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        📁 Quản lý danh mục
                                                    </Link>
                                                    <Link
                                                        to="/admin/comments"
                                                        onClick={() => setIsAdminMenuOpen(false)}
                                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        💬 Quản lý bình luận
                                                    </Link>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">
                                        👋 {user?.name}
                                        {isAdmin && (
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                                    >
                                        Đăng nhập
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Đăng ký
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {children}
            </main>
            
            {/* Footer */}
            <footer className="bg-white border-t mt-8">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-500 text-sm">
                        © 2025 My Blog - Laravel + React + MongoDB + Redis
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;

