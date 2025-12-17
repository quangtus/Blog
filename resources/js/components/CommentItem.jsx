/**
 * CommentItem Component - Hiển thị một comment
 * 
 * IPO Analysis:
 * - INPUT: comment object (props), user từ AuthContext
 * - PROCESS: Check permissions, handle delete
 * - OUTPUT: UI comment với actions
 */
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
    const isOwner = user?._id === comment.user_id;
    const isPending = comment.status === 'pending';

    return (
        <div className={`border-l-4 ${isPending ? 'border-yellow-400 bg-yellow-50' : 'border-blue-500'} pl-4 py-2 rounded-r`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center flex-wrap gap-2">
                    <span className="font-semibold text-gray-900">{comment.user?.name}</span>
                    <span className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString('vi-VN')}
                    </span>
                    {/* Hiển thị badge pending cho chính chủ */}
                    {isPending && isOwner && (
                        <span className="px-2 py-0.5 text-xs bg-yellow-200 text-yellow-800 rounded-full">
                            ⏳ Đang chờ duyệt
                        </span>
                    )}
                </div>
                {canDelete && (
                    <button
                        onClick={() => {
                            if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
                                deleteMutation.mutate();
                            }
                        }}
                        disabled={deleteMutation.isLoading}
                        className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50"
                    >
                        🗑️ Xóa
                    </button>
                )}
            </div>
            <p className="text-gray-700">{comment.content}</p>
            
            {/* Replies */}
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

