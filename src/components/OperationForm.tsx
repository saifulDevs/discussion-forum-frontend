import React, { useState } from 'react';
import api from '../api';

interface Props {
    rootPostId: string;
    parentOpId?: string;
    onOperationAdded: () => void;
    onCancel: () => void;
}

const OperationForm: React.FC<Props> = ({ rootPostId, parentOpId, onOperationAdded, onCancel }) => {
    const [opType, setOpType] = useState('add');
    const [rightNumber, setRightNumber] = useState<number | ''>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rightNumber === '') return;

        try {
            await api.post(`/posts/${rootPostId}/operations`, {
                parentOpId,
                opType,
                rightNumber: Number(rightNumber),
            });
            onOperationAdded();
        } catch (error) {
            alert('Failed to add operation');
        }
    };

    return (
        <div className="p-4 mt-4 border border-dashed border-gray-300 rounded bg-gray-50">
            <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
                <div>
                    <label className="block mb-1 text-sm font-bold text-gray-700">Operation</label>
                    <select
                        value={opType}
                        onChange={(e) => setOpType(e.target.value)}
                        className="px-3 py-2 bg-white border rounded shadow focus:outline-none focus:shadow-outline"
                    >
                        <option value="add">Add (+)</option>
                        <option value="sub">Subtract (-)</option>
                        <option value="mul">Multiply (×)</option>
                        <option value="div">Divide (÷)</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-bold text-gray-700">Number</label>
                    <input
                        type="number"
                        value={rightNumber}
                        onChange={(e) => setRightNumber(Number(e.target.value))}
                        className="w-24 px-3 py-2 border rounded shadow focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
                    >
                        Calculate
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

export default OperationForm;
