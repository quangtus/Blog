import { useAuth } from '../contexts/AuthContext';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../config/axios';

const CommentItem = ({ comment }) => {
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const deleteMutation = useMutation(
        () => axios.delete(`/api/comments/${comment._id}`),
        {
            onSuccess: () => {
                queryClient.invalidateQueries('comments');
            },
        }
    );

    const canDelete = isAuthenticated && (user?._id === comment.user_id || user?.role === 'admin');

    return (
        <div className="border-l-4 border-blue-500 pl-4 py-2">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <span className="font-semibold text-gray-900">{comment.user?.name}</span>
                    <span className="text-sm text-gray-500 ml-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                </div>
                {canDelete && (
                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to delete this comment?')) {
                                deleteMutation.mutate();
                            }
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                    >
                        Delete
                    </button>
                )}
            </div>
            <p className="text-gray-700">{comment.content}</p>
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-4 space-y-2">
                    {comment.replies.map((reply) => (
                        <CommentItem key={reply._id} comment={reply} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CommentItem;

