import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';

const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin } = useAuth();
    const queryClient = useQueryClient();

    const { data: post, isLoading } = useQuery(['post', id], async () => {
        const response = await axios.get(`/api/posts/${id}`);
        return response.data;
    });

    const deleteMutation = useMutation(
        () => axios.delete(`/api/posts/${id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('posts');
                navigate('/');
            },
        }
    );

    if (isLoading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    if (!post) {
        return <div className="text-center py-12">Post not found</div>;
    }

    const canEdit = isAuthenticated && (user?._id === post.user_id || isAdmin);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article className="bg-white rounded-lg shadow-md overflow-hidden">
                {post.featured_image && (
                    <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-96 object-cover"
                    />
                )}
                <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-sm text-blue-600 font-semibold">
                                {post.category?.name}
                            </span>
                            <span className="text-sm text-gray-500">
                                {new Date(post.created_at).toLocaleDateString()}
                            </span>
                        </div>
                        {canEdit && (
                            <div className="flex space-x-2">
                                <Link
                                    to={`/posts/${id}/edit`}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={() => {
                                        if (window.confirm('Are you sure you want to delete this post?')) {
                                            deleteMutation.mutate();
                                        }
                                    }}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                    <div className="text-sm text-gray-500 mb-6">
                        By <span className="font-semibold">{post.user?.name}</span>
                    </div>
                    <div
                        className="prose max-w-none mb-8"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </article>

            <div className="mt-8 bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
                <CommentList postId={id} />
                {isAuthenticated ? (
                    <CommentForm postId={id} />
                ) : (
                    <div className="text-center py-4">
                        <Link to="/login" className="text-blue-600 hover:text-blue-800">
                            Login to comment
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetail;

