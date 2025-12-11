import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin } = useAuth();
    const queryClient = useQueryClient();

    const { data: post, isLoading } = useQuery(['post', id], async () => {
        const response = await axios.get(`/api/posts/${id}`);
        return response.data;
    });

    const { data: categories } = useQuery('categories', async () => {
        const response = await axios.get('/api/categories');
        return response.data;
    });

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        excerpt: '',
        category_id: '',
        featured_image: '',
        status: 'draft',
    });

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title || '',
                content: post.content || '',
                excerpt: post.excerpt || '',
                category_id: post.category_id || '',
                featured_image: post.featured_image || '',
                status: post.status || 'draft',
            });
        }
    }, [post]);

    useEffect(() => {
        if (!isAuthenticated || (post && user && post.user_id !== user._id && !isAdmin)) {
            navigate('/');
        }
    }, [isAuthenticated, post, user, isAdmin, navigate]);

    const updateMutation = useMutation(
        (data) => axios.put(`/api/posts/${id}`, data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['post', id]);
                queryClient.invalidateQueries('posts');
                navigate(`/posts/${id}`);
            },
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(formData);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    if (isLoading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!post) {
        return <div className="text-center py-12">Post not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Post</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Category
                        </label>
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Select a category</option>
                            {categories?.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Featured Image URL
                        </label>
                        <input
                            type="url"
                            name="featured_image"
                            value={formData.featured_image}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Excerpt
                        </label>
                        <textarea
                            name="excerpt"
                            value={formData.excerpt}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Content
                        </label>
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            rows="15"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/posts/${id}`)}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isLoading}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {updateMutation.isLoading ? 'Updating...' : 'Update Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPost;

