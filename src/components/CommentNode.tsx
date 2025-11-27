import React from 'react';
import { useSelector } from 'react-redux';
import { ComputationNode as ComputationNodeType, useDeleteNodeMutation } from '../features/apiSlice';
import { RootState } from '../features/store';

interface Props {
    node: ComputationNodeType;
    parentValue?: number;
    onReply: () => void;
    children?: React.ReactNode;
}

const CommentNode: React.FC<Props> = ({ node, parentValue, onReply, children }) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [deleteNode, { isLoading: isDeleting }] = useDeleteNodeMutation();

    const isCreator = user?.id === node.userId.id;

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this node? This will also delete all its children.')) {
            try {
                await deleteNode(node._id).unwrap();
            } catch (error) {
                console.error('Failed to delete node:', error);
                alert('Failed to delete node.');
            }
        }
    };

    const renderComputation = () => {
        if (node.parentId === null) {
            return <span className="text-2xl font-bold">{node.value}</span>;
        }
        return (
            <span className="text-lg">
                {parentValue} {node.operation} {node.rightNumber} ={' '}
                <span className="font-bold">{node.value}</span>
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-start p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="flex-grow">
                    <div className="flex items-center justify-between">
                        <div className="text-gray-800">{renderComputation()}</div>
                        <div className="text-xs text-gray-500">by @{node.userId.username}</div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        {user && (
                        <button onClick={onReply} className="text-sm font-medium text-blue-600 hover:underline">
                            Reply
                        </button>
                        )}
                        {isCreator && (
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-sm font-medium text-red-600 hover:underline disabled:text-gray-400"
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {children && <div className="pl-8 border-l-2 border-gray-200">{children}</div>}
        </div>
    );
};

export default CommentNode;
