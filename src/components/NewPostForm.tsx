import React, { useState } from 'react';
import { useCreateRootMutation } from '../features/apiSlice';

const NewPostForm: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [createRoot, { isLoading }] = useCreateRootMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRoot({ title, content }).unwrap();
            setTitle('');
            setContent('');
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    return (
        <div className="p-4 mb-8 bg-white rounded shadow">
            <h2 className="mb-4 text-xl font-bold">Start a New Discussion</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                    <label className="block mb-1 text-sm font-bold text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:shadow-outline"
                        placeholder="Discussion Title"
                        required
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-gray-700">Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:shadow-outline"
                        placeholder="What's on your mind?"
                        rows={3}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
                        isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                    }`}
                >
                    {isLoading ? 'Creating...' : 'Create Discussion'}
                </button>
            </form>
        </div>
    );
};

export default NewPostForm;
