import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import CommentForm from '../components/CommentForm';
import CommentNode from '../components/CommentNode';
import { useGetTreeQuery, ComputationNode as ComputationNodeType } from '../features/apiSlice';

const findNode = (nodes: ComputationNodeType[], id: string): ComputationNodeType | null => {
    for (const node of nodes) {
        if (node._id === id) {
            return node;
        }
        const found = findNode(node.children, id);
        if (found) {
            return found;
        }
    }
    return null;
};

const PostView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data: nodes, isLoading, error } = useGetTreeQuery();
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    const node = useMemo(() => {
        if (!nodes || !id) return null;
        return findNode(nodes, id);
    }, [nodes, id]);

    const renderTree = (nodes: ComputationNodeType[], parentValue?: number) => {
        return nodes.map((node) => (
            <div key={node._id} className="mt-4">
                <CommentNode node={node} parentValue={parentValue} onReply={() => setReplyingTo(node._id)}>
                    {replyingTo === node._id && (
                        <div className="my-4">
                            <CommentForm
                                parentId={node._id}
                                onReplyAdded={() => setReplyingTo(null)}
                                onCancel={() => setReplyingTo(null)}
                            />
                        </div>
                    )}
                    {node.children && node.children.length > 0 && renderTree(node.children, node.value)}
                </CommentNode>
            </div>
        ));
    };

    if (isLoading) return <div className="p-8 text-center">Loading Computation...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading computation.</div>;
    if (!node) return <div className="p-8 text-center">Computation not found.</div>;

    return (
        <div className="container px-4 py-8 mx-auto max-w-4xl">
            <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
                &larr; Back to Home
            </Link>

            <CommentNode node={node} onReply={() => setReplyingTo(node._id)}>
                {replyingTo === node._id && (
                    <div className="my-4">
                        <CommentForm
                            parentId={node._id}
                            onReplyAdded={() => setReplyingTo(null)}
                            onCancel={() => setReplyingTo(null)}
                        />
                    </div>
                )}
                {node.children && node.children.length > 0 && renderTree(node.children, node.value)}
            </CommentNode>
        </div>
    );
};

export default PostView;

