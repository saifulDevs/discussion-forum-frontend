import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useCreateRootMutation } from '../features/apiSlice';

interface NewPostFormProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewPostForm: React.FC<NewPostFormProps> = ({ isOpen, onClose }) => {
    const [value, setValue] = useState('');
    const [createRoot, { isLoading }] = useCreateRootMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createRoot({ value: Number(value) }).unwrap();
            setValue('');
            onClose();
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                    <Dialog.Title className="text-xl font-bold">Start a New Computation</Dialog.Title>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                        <div>
                            <label className="block mb-1 text-sm font-bold text-gray-700">Starting Number</label>
                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className="w-full px-3 py-2 border rounded shadow focus:outline-none focus:shadow-outline"
                                placeholder="Enter a number"
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
                                    isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                                }`}
                            >
                                {isLoading ? 'Creating...' : 'Create Computation'}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default NewPostForm;
