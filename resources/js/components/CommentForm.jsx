import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import axios from '../config/axios';

const CommentForm = ({ postId, parentId = null }) => {
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    const createMutation = useMutation(
        (data) => axios.post('/api/comments', data),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['comments', postId]);
                setContent('');
            },
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            createMutation.mutate({
                content: content.trim(),
                post_id: postId,
                parent_id: parentId,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-6">
            <div className="mb-4">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Write a comment..."
                    rows="4"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <button
                type="submit"
                disabled={createMutation.isLoading || !content.trim()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
                {createMutation.isLoading ? 'Posting...' : 'Post Comment'}
            </button>
        </form>
    );
};

export default CommentForm;

