/**
 * Category Management - Quản lý danh mục (CRUD)
 * 
 * IPO Analysis:
 * - INPUT: 
 *   + API GET /categories (list)
 *   + Form data (name, description)
 *   + User events (click edit, delete, submit)
 * - PROCESS: 
 *   + useQuery để fetch categories
 *   + useMutation cho create/update/delete
 *   + State management cho form và modal
 * - OUTPUT: 
 *   + Bảng danh sách categories
 *   + Modal form thêm/sửa
 *   + Toast notifications
 */
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from '../../config/axios';

const CategoryList = () => {
    const queryClient = useQueryClient();
    
    // State cho modal và form
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [notification, setNotification] = useState(null);

    // Fetch categories
    const { data: categories, isLoading } = useQuery('categories', async () => {
        const response = await axios.get('/api/categories');
        return response.data;
    });

    // Create mutation
    const createMutation = useMutation(
        (data) => axios.post('/api/categories', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('categories');
                queryClient.invalidateQueries('adminStats');
                closeModal();
                showNotification('Thêm danh mục thành công!', 'success');
            },
            onError: (error) => {
                showNotification(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
            },
        }
    );

    // Update mutation
    const updateMutation = useMutation(
        ({ id, data }) => axios.put(`/api/categories/${id}`, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('categories');
                closeModal();
                showNotification('Cập nhật danh mục thành công!', 'success');
            },
            onError: (error) => {
                showNotification(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
            },
        }
    );

    // Delete mutation
    const deleteMutation = useMutation(
        (id) => axios.delete(`/api/categories/${id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('categories');
                queryClient.invalidateQueries('adminStats');
                showNotification('Xóa danh mục thành công!', 'success');
            },
            onError: (error) => {
                showNotification(error.response?.data?.message || 'Có lỗi xảy ra', 'error');
            },
        }
    );

    // Helper functions
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name, description: category.description || '' });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '' });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            updateMutation.mutate({ id: editingCategory._id, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = (category) => {
        if (window.confirm(`Bạn có chắc muốn xóa danh mục "${category.name}"?`)) {
            deleteMutation.mutate(category._id);
        }
    };

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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">📁 Quản lý danh mục</h1>
                    <p className="mt-2 text-gray-600">
                        Tổng cộng: {categories?.length || 0} danh mục
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center"
                >
                    <span className="mr-2">➕</span>
                    Thêm danh mục
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tên danh mục
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Slug
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mô tả
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories?.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                    Chưa có danh mục nào. Hãy thêm danh mục mới!
                                </td>
                            </tr>
                        ) : (
                            categories?.map((category) => (
                                <tr key={category._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{category.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 rounded">
                                            {category.slug}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-500 truncate max-w-xs">
                                            {category.description || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => openModal(category)}
                                            className="text-blue-600 hover:text-blue-900 mr-4"
                                        >
                                            ✏️ Sửa
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            🗑️ Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={closeModal}
                        ></div>

                        {/* Modal */}
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <form onSubmit={handleSubmit}>
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        {editingCategory ? '✏️ Sửa danh mục' : '➕ Thêm danh mục mới'}
                                    </h3>
                                    
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Tên danh mục *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Ví dụ: Công nghệ"
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Mô tả
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Mô tả ngắn về danh mục..."
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="submit"
                                        disabled={createMutation.isLoading || updateMutation.isLoading}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                                    >
                                        {(createMutation.isLoading || updateMutation.isLoading) 
                                            ? 'Đang xử lý...' 
                                            : (editingCategory ? 'Cập nhật' : 'Thêm mới')
                                        }
                                    </button>
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                    >
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* IPO Explanation for Learning */}
            <div className="mt-8 bg-purple-50 rounded-lg p-6 border border-purple-200">
                <h2 className="text-xl font-bold text-purple-900 mb-4">📚 Giải thích IPO - Category CRUD</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-green-600 mb-2">📥 INPUT</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>GET /api/categories</li>
                            <li>Form: name, description</li>
                            <li>Events: click, submit</li>
                            <li>Modal state (open/close)</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-yellow-600 mb-2">⚙️ PROCESS</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>useQuery: fetch list</li>
                            <li>useMutation: create/update/delete</li>
                            <li>Form validation</li>
                            <li>Confirm dialog</li>
                        </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="font-bold text-red-600 mb-2">📤 OUTPUT</h3>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                            <li>Table hiển thị categories</li>
                            <li>Modal form</li>
                            <li>Notification toast</li>
                            <li>Cache invalidation</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryList;
