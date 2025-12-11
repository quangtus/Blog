import { useQuery } from 'react-query';
import axios from '../config/axios';
import CommentItem from './CommentItem';

const CommentList = ({ postId }) => {
    const { data: comments, isLoading } = useQuery(
        ['comments', postId],
        async () => {
            const response = await axios.get('/api/comments', {
                params: { post_id: postId },
            });
            return response.data;
        }
    );

    if (isLoading) {
        return <div className="text-center py-4">Loading comments...</div>;
    }

    if (!comments || comments.length === 0) {
        return <div className="text-center py-4 text-gray-500">No comments yet. Be the first to comment!</div>;
    }

    return (
        <div className="space-y-4 mb-6">
            {comments.map((comment) => (
                <CommentItem key={comment._id} comment={comment} />
            ))}
        </div>
    );
};

export default CommentList;

