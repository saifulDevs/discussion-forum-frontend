import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import OperationForm from '../components/OperationForm';

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
    const [post, setPost] = useState<RootPost | null>(null);
    const [operations, setOperations] = useState<Operation[]>([]);
    const [replyingTo, setReplyingTo] = useState<string | null>(null); // null for root, or opId
    const user = localStorage.getItem('user');

    useEffect(() => {
        fetchPostData();
    }, [id]);

    const fetchPostData = async () => {
        try {
            const { data } = await api.get(`/posts/${id}`);
            setPost(data.post);
            setOperations(data.operations);
            setReplyingTo(null);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    const buildTree = (parentId: string | null) => {
        return operations
            .filter((op) => (op.parentOpId || null) === parentId)
            .map((op) => (
                <div key={op._id} className="pl-4 mt-4 ml-4 border-l-2 border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-gray-800">
                            {op.opType === 'add' && '+'}
                            {op.opType === 'sub' && '-'}
                            {op.opType === 'mul' && '×'}
                            {op.opType === 'div' && '÷'}
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
                            onOperationAdded={fetchPostData}
                            onCancel={() => setReplyingTo(null)}
                        />
                    )}
                    {buildTree(op._id)}
                </div>
            ));
    };

    if (!post) return <div className="p-8 text-center">Loading...</div>;

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
                            onOperationAdded={fetchPostData}
                            onCancel={() => setReplyingTo(null)}
                        />
                    )}
                    {buildTree(null)}
                </div>
            </div>
        </div>
    );
};

export default PostView;
