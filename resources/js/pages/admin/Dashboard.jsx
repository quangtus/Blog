/**
 * Admin Dashboard - Trang tổng quan cho Admin
 * 
 * IPO Analysis:
 * - INPUT: 
 *   + API /admin/stats
 * - PROCESS: 
 *   + Fetch stats từ server
 *   + Tính toán và format dữ liệu
 * - OUTPUT: 
 *   + UI hiển thị thống kê
 *   + Quick links đến các trang quản lý
 */
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';

const Dashboard = () => {
    // Fetch dashboard statistics
    const { data: stats, isLoading, error } = useQuery('adminStats', async () => {
        const response = await axios.get('/api/admin/stats');
        return response.data;
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
                Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.
            </div>
        );
    }

    // Stats cards configuration
    const statCards = [
        {
            title: 'Tổng người dùng',
            value: stats?.total_users || 0,
            icon: '👥',
            color: 'bg-blue-500',
            link: null,
        },
        {
            title: 'Tổng bài viết',
            value: stats?.total_posts || 0,
            icon: '📝',
            color: 'bg-green-500',
            subtext: `${stats?.published_posts || 0} đã xuất bản`,
            link: '/',
        },
        {
            title: 'Danh mục',
            value: stats?.total_categories || 0,
            icon: '📁',
            color: 'bg-purple-500',
            link: '/admin/categories',
        },
        {
            title: 'Bình luận',
            value: stats?.total_comments || 0,
            icon: '💬',
            color: 'bg-yellow-500',
            subtext: `${stats?.pending_comments || 0} chờ duyệt`,
            link: '/admin/comments',
        },
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">📊 Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">
                    Tổng quan về hoạt động của blog
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        <div className={`${card.color} px-4 py-2`}>
                            <span className="text-2xl">{card.icon}</span>
                        </div>
                        <div className="p-4">
                            <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                            {card.subtext && (
                                <p className="text-sm text-gray-500 mt-1">{card.subtext}</p>
                            )}
                            {card.link && (
                                <Link
                                    to={card.link}
                                    className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                                >
                                    Xem chi tiết →
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">⚡ Thao tác nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/admin/categories"
                        className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                    >
                        <span className="text-3xl mr-4">📁</span>
                        <div>
                            <h3 className="font-semibold text-gray-900">Quản lý danh mục</h3>
                            <p className="text-sm text-gray-500">Thêm, sửa, xóa danh mục</p>
                        </div>
                    </Link>
                    <Link
                        to="/admin/comments"
                        className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
                    >
                        <span className="text-3xl mr-4">💬</span>
                        <div>
                            <h3 className="font-semibold text-gray-900">Duyệt bình luận</h3>
                            <p className="text-sm text-gray-500">
                                {stats?.pending_comments > 0 
                                    ? `${stats.pending_comments} bình luận chờ duyệt`
                                    : 'Không có bình luận chờ duyệt'
                                }
                            </p>
                        </div>
                    </Link>
                    <Link
                        to="/posts/create"
                        className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <span className="text-3xl mr-4">✏️</span>
                        <div>
                            <h3 className="font-semibold text-gray-900">Viết bài mới</h3>
                            <p className="text-sm text-gray-500">Tạo bài viết mới</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* IPO Explanation for Learning */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                <h2 className="text-xl font-bold text-blue-900 mb-4">📚 Giải thích IPO - Dashboard</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-green-600 mb-2">📥 INPUT</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>API endpoint: /api/admin/stats</li>
                            <li>User authentication (admin role)</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-600 mb-2">⚙️ PROCESS</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>useQuery fetch data</li>
                            <li>Map stats to UI cards</li>
                            <li>Handle loading/error states</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-red-600 mb-2">📤 OUTPUT</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Stats cards với số liệu</li>
                            <li>Quick action links</li>
                            <li>Loading/Error UI</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
