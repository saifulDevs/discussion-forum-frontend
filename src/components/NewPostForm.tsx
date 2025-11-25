import React, { useState } from 'react';
import api from '../api';

interface Props {
    onPostCreated: (post: any) => void;
}

const NewPostForm: React.FC<Props> = ({ onPostCreated }) => {
    const [startNumber, setStartNumber] = useState<number | ''>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (startNumber === '') return;

        try {
            const { data } = await api.post('/posts', { startNumber: Number(startNumber) });
            onPostCreated(data);
            setStartNumber('');
        } catch (error) {
            alert('Failed to create post');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-gray-800">Start a new discussion</h3>
            <div className="mb-4">
                <label className="block mb-2 text-sm font-bold text-gray-700">Starting Number:</label>
                <input
                    type="number"
                    value={startNumber}
                    onChange={(e) => setStartNumber(Number(e.target.value))}
                    className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                    required
                />
            </div>
            <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
            >
                Create Post
            </button>
        </form>
    );
};

export default NewPostForm;
