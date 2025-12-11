import { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from '../config/axios';
import CategoryFilter from '../components/CategoryFilter';

const Home = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const { data: postsData, isLoading } = useQuery(
        ['posts', selectedCategory, searchTerm],
        async () => {
            const params = {};
            if (selectedCategory) params.category_id = selectedCategory;
            if (searchTerm) params.search = searchTerm;
            const response = await axios.get('/api/posts', { params });
            return response.data;
        }
    );

    const { data: categories } = useQuery('categories', async () => {
        const response = await axios.get('/api/categories');
        return response.data;
    });

    if (isLoading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    const posts = postsData?.data || [];

    return (
        <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Posts</h1>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <CategoryFilter
                        categories={categories || []}
                        selectedCategory={selectedCategory}
                        onCategoryChange={setSelectedCategory}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-500">
                        No posts found.
                    </div>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            {post.featured_image && (
                                <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-blue-600 font-semibold">
                                        {post.category?.name}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <Link to={`/posts/${post._id}`}>
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600">
                                        {post.title}
                                    </h2>
                                </Link>
                                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">By {post.user?.name}</span>
                                    <Link
                                        to={`/posts/${post._id}`}
                                        className="text-blue-600 hover:text-blue-800 font-semibold"
                                    >
                                        Read more →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {postsData?.links && (
                <div className="mt-8 flex justify-center">
                    <div className="flex space-x-2">
                        {postsData.links.map((link, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    if (link.url) {
                                        const url = new URL(link.url);
                                        setSelectedCategory(url.searchParams.get('category_id') || '');
                                    }
                                }}
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
        </div>
    );
};

export default Home;

