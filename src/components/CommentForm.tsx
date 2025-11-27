import React, { useState } from 'react';
import { Operation, useCreateReplyMutation } from '../features/apiSlice';

interface Props {
    parentId: string;
    onReplyAdded: () => void;
    onCancel: () => void;
}

const CommentForm: React.FC<Props> = ({ parentId, onReplyAdded, onCancel }) => {
    const [rightNumber, setRightNumber] = useState('');
    const [operation, setOperation] = useState<Operation>('+');
 
    const [createReply, { isLoading }] = useCreateReplyMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rightNumber.trim()) return;

        try {
            await createReply({
                parentId,
                operation,
                rightNumber: Number(rightNumber),
            }).unwrap();
            setRightNumber('');
            onReplyAdded();
        } catch (error) {
            console.error('Failed to add reply:', error);
            alert('Failed to add reply');
        }
    };

    return (
        <div className="p-4 mt-4 border border-dashed border-gray-300 rounded bg-gray-50">
            <form onSubmit={handleSubmit} className="flex items-center gap-4">
                <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value as Operation)}
                    className="px-3 py-2 border rounded shadow focus:outline-none focus:shadow-outline"
                >
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">*</option>
                    <option value="/">/</option>
                </select>
                <input
                    type="number"
                    value={rightNumber}
                    onChange={(e) => setRightNumber(e.target.value)}
                    className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:shadow-outline"
                    placeholder="Enter a number"
                    required
                />
                <div className="flex gap-2 w-1/2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
                            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? 'Replying...' : 'Add Reply'}
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
