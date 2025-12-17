/**
 * Comment Management - Quản lý và duyệt bình luận
 * 
 * IPO Analysis:
 * - INPUT: 
 *   + API GET /admin/comments
 *   + Filter by status (all, pending, approved, rejected)
 *   + User events (approve, reject, delete)
 * - PROCESS: 
 *   + useQuery để fetch comments
 *   + useMutation cho approve/reject/delete
 *   + Filter logic
 * - OUTPUT: 
 *   + Bảng danh sách comments với status
 *   + Action buttons
 *   + Notifications
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from '../../config/axios';

const CommentManagement = () => {
    const queryClient = useQueryClient();
    const [statusFilter, setStatusFilter] = useState('');
    const [notification, setNotification] = useState(null);

    // Fetch comments
    const { data: commentsData, isLoading } = useQuery(
        ['adminComments', statusFilter],
        async () => {
            const params = statusFilter ? { status: statusFilter } : {};
            const response = await axios.get('/api/admin/comments', { params });
            return response.data;
        }
    );

    // Approve mutation
    const approveMutation = useMutation(
        (id) => axios.post(`/api/comments/${id}/approve`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('adminComments');
                queryClient.invalidateQueries('adminStats');
                showNotification('Đã duyệt bình luận!', 'success');
            },
            onError: (error) => {
                showNotification(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
            },
        }
    );

    // Reject mutation
    const rejectMutation = useMutation(
        (id) => axios.post(`/api/comments/${id}/reject`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('adminComments');
                queryClient.invalidateQueries('adminStats');
                showNotification('Đã từ chối bình luận!', 'success');
            },
            onError: (error) => {
                showNotification(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
            },
        }
    );

    // Delete mutation
    const deleteMutation = useMutation(
        (id) => axios.delete(`/api/comments/${id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('adminComments');
                queryClient.invalidateQueries('adminStats');
                showNotification('Đã xóa bình luận!', 'success');
            },
            onError: (error) => {
                showNotification(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
            },
        }
    );

    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleDelete = (comment) => {
        if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
            deleteMutation.mutate(comment._id);
        }
    };

    // Get status badge style
    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        const labels = {
            pending: '⏳ Chờ duyệt',
            approved: '✅ Đã duyệt',
            rejected: '❌ Đã từ chối',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status] || 'bg-gray-100'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const comments = commentsData?.data || commentsData || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
                    notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                } text-white`}>
                    {notification.message}
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">💬 Quản lý bình luận</h1>
                <p className="mt-2 text-gray-600">
                    Duyệt, từ chối hoặc xóa bình luận của người dùng
                </p>
            </div>

            {/* Filter */}
            <div className="mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => setStatusFilter('')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        statusFilter === '' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    📋 Tất cả
                </button>
                <button
                    onClick={() => setStatusFilter('pending')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        statusFilter === 'pending' 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    ⏳ Chờ duyệt
                </button>
                <button
                    onClick={() => setStatusFilter('approved')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        statusFilter === 'approved' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    ✅ Đã duyệt
                </button>
                <button
                    onClick={() => setStatusFilter('rejected')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        statusFilter === 'rejected' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    ❌ Đã từ chối
                </button>
            </div>

            {/* Comments List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {comments.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        <div className="text-5xl mb-4">📭</div>
                        <p>Không có bình luận nào</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {comments.map((comment) => (
                            <div key={comment._id} className="p-6 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                            {comment.user?.name?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {comment.user?.name || 'Unknown User'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(comment.created_at).toLocaleString('vi-VN')}
                                            </p>
                                        </div>
                                    </div>
                                    {getStatusBadge(comment.status)}
                                </div>

                                {/* Post reference */}
                                {comment.post && (
                                    <div className="mb-3 p-2 bg-gray-100 rounded text-sm">
                                        <span className="text-gray-500">Bài viết: </span>
                                        <a 
                                            href={`/posts/${comment.post._id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {comment.post.title}
                                        </a>
                                    </div>
                                )}

                                {/* Comment content */}
                                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                                    {comment.content}
                                </p>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    {comment.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => approveMutation.mutate(comment._id)}
                                                disabled={approveMutation.isLoading}
                                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                            >
                                                ✅ Duyệt
                                            </button>
                                            <button
                                                onClick={() => rejectMutation.mutate(comment._id)}
                                                disabled={rejectMutation.isLoading}
                                                className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                            >
                                                ❌ Từ chối
                                            </button>
                                        </>
                                    )}
                                    {comment.status === 'rejected' && (
                                        <button
                                            onClick={() => approveMutation.mutate(comment._id)}
                                            disabled={approveMutation.isLoading}
                                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                        >
                                            ✅ Duyệt lại
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(comment)}
                                        disabled={deleteMutation.isLoading}
                                        className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                                    >
                                        🗑️ Xóa
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Pagination */}
            {commentsData?.links && (
                <div className="mt-6 flex justify-center">
                    <div className="flex space-x-2">
                        {commentsData.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                className={`px-4 py-2 rounded ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                        ? 'bg-white text-gray-700 hover:bg-gray-100'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* IPO Explanation for Learning */}
            <div className="mt-8 bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                <h2 className="text-xl font-bold text-yellow-900 mb-4">📚 Giải thích IPO - Comment Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-green-600 mb-2">📥 INPUT</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>GET /api/admin/comments</li>
                            <li>Status filter (state)</li>
                            <li>User clicks (approve/reject/delete)</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-600 mb-2">⚙️ PROCESS</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>useQuery with filter params</li>
                            <li>3 mutations (approve/reject/delete)</li>
                            <li>Optimistic UI updates</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-red-600 mb-2">📤 OUTPUT</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Comment cards with status badges</li>
                            <li>Filter buttons</li>
                            <li>Action buttons per status</li>
                            <li>Toast notifications</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentManagement;
