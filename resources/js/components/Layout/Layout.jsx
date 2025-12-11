import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

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
                                My Blog
                            </Link>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <Link
                                    to="/"
                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700"
                                >
                                    Home
                                </Link>
                                {isAuthenticated && (
                                    <Link
                                        to="/posts/create"
                                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700"
                                    >
                                        Create Post
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center">
                            {isAuthenticated ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-700">Hello, {user?.name}</span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        to="/login"
                                        className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Register
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
        </div>
    );
};

export default Layout;

