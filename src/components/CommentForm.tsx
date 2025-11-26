import React, { useState } from 'react';
import { useAddCommentMutation } from '../features/apiSlice';

interface Props {
    rootPostId: string;
    parentId?: string;
    onCommentAdded: () => void;
    onCancel: () => void;
}

const CommentForm: React.FC<Props> = ({ rootPostId, parentId, onCommentAdded, onCancel }) => {
    const [content, setContent] = useState('');
    const [addComment, { isLoading }] = useAddCommentMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            await addComment({
                id: rootPostId,
                parentId,
                content,
            }).unwrap();
            setContent('');
            onCommentAdded();
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('Failed to add comment');
        }
    };

    return (
        <div className="p-4 mt-4 border border-dashed border-gray-300 rounded bg-gray-50">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 text-sm font-bold text-gray-700">Your Comment</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:shadow-outline"
                        rows={3}
                        placeholder="Write a reply..."
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? 'Posting...' : 'Post Reply'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 font-bold text-gray-700 bg-gray-300 rounded hover:bg-gray-400 focus:outline-none focus:shadow-outline"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CommentForm;
