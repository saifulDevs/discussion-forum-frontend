import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import OperationForm from '../components/OperationForm';
import { useGetPostQuery } from '../features/apiSlice';
import { RootState } from '../features/store';

interface Operation {
    _id: string;
    rootPostId: string;
    parentOpId?: string;
    userId: { _id: string; username: string };
    opType: string;
    leftNumber: number;
    rightNumber: number;
    resultNumber: number;
    createdAt: string;
}

interface RootPost {
    _id: string;
    startNumber: number;
    userId: { _id: string; username: string };
    createdAt: string;
}

const PostView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useGetPostQuery(id || '');
    const [replyingTo, setReplyingTo] = useState<string | null>(null); // null for root, or opId
    const user = useSelector((state: RootState) => state.auth.user);

    const post: RootPost | undefined = data?.post;
    const operations: Operation[] = data?.operations || [];

    // Optimize tree construction: O(N) instead of O(N^2)
    const operationsMap = React.useMemo(() => {
        const map = new Map<string | null, Operation[]>();
        operations.forEach(op => {
            const parentId = op.parentOpId || null;
            if (!map.has(parentId)) {
                map.set(parentId, []);
            }
            map.get(parentId)!.push(op);
        });
        return map;
    }, [operations]);

    const renderTree = (parentId: string | null) => {
        const children = operationsMap.get(parentId);
        if (!children) return null;

        return children.map((op) => (
            <div key={op._id} className="pl-4 mt-4 ml-4 border-l-2 border-gray-200">
                <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-gray-800">
                        {op.leftNumber}
                        {' '}
                        {op.opType === 'add' && '+'}
                        {op.opType === 'sub' && '-'}
                        {op.opType === 'mul' && '×'}
                        {op.opType === 'div' && '÷'}
                        {' '}
                        {op.rightNumber} = <span className="text-blue-600">{op.resultNumber}</span>
                    </span>
                    <span className="text-xs text-gray-500">
                        by {op.userId?.username}
                    </span>
                    {user && (
                        <button
                            onClick={() => setReplyingTo(op._id)}
                            className="text-xs text-blue-500 hover:underline focus:outline-none"
                        >
                            Reply
                        </button>
                    )}
                </div>
                {replyingTo === op._id && (
                    <OperationForm
                        rootPostId={post!._id}
                        parentOpId={op._id}
                        onOperationAdded={() => setReplyingTo(null)}
                        onCancel={() => setReplyingTo(null)}
                    />
                )}
                {renderTree(op._id)}
            </div>
        ));
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading discussion</div>;
    if (!post) return <div className="p-8 text-center">Post not found</div>;

    return (
        <div className="container px-4 py-8 mx-auto">
            <Link to="/" className="text-blue-500 hover:underline">&larr; Back to Home</Link>
            <div className="p-6 mt-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-gray-900">Discussion on {post.startNumber}</h1>
                <p className="text-sm text-gray-600">Started by {post.userId?.username}</p>

                <div className="mt-6">
                    <div className="flex items-center gap-2 text-xl font-bold text-gray-800">
                        <span>Start: {post.startNumber}</span>
                        {user && (
                            <button
                                onClick={() => setReplyingTo('root')}
                                className="text-sm font-normal text-blue-500 hover:underline focus:outline-none"
                            >
                                Reply
                            </button>
                        )}
                    </div>
                    {replyingTo === 'root' && (
                        <OperationForm
                            rootPostId={post._id}
                            onOperationAdded={() => setReplyingTo(null)} // RTK Query handles cache invalidation
                            onCancel={() => setReplyingTo(null)}
                        />
                    )}
                    {renderTree(null)}
                </div>
            </div>
        </div>
    );
};

export default PostView;
