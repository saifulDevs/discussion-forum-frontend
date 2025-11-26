import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CommentForm from '../components/CommentForm';
import CommentNode from '../components/CommentNode';
import { useGetPostQuery, Comment } from '../features/apiSlice';
import { RootState } from '../features/store';

// New Post interface (replaces RootPost)
interface Post {
    _id: string;
    title: string;
    content: string;
    userId: { _id: string; username: string };
    createdAt: string;
}

const PostView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useGetPostQuery(id!);
    const post = data?.post as unknown as Post | undefined;
    const comments: Comment[] = data?.comments || [];
    const user = useSelector((state: RootState) => state.auth.user);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    // Create an adjacency map for O(N) tree construction
    const commentsMap = React.useMemo(() => { // Changed operationsMap to commentsMap
        const map = new Map<string | null, Comment[]>(); // Changed Operation[] to Comment[]
        comments.forEach((comment) => { // Changed operations.forEach(op) to comments.forEach(comment)
            const parentId = comment.parentId || null; // Changed op.parentOpId to comment.parentId
            if (!map.has(parentId)) {
                map.set(parentId, []);
            }
            map.get(parentId)!.push(comment);
        });
        return map;
    }, [comments]); // Changed operations to comments

    const renderTree = (parentId: string | null) => {
        const children = commentsMap.get(parentId); // Changed operationsMap to commentsMap
        if (!children) return null;

        return children.map((comment) => ( // Changed op to comment
            <div key={comment._id} className="mt-4">
                <CommentNode
                    username={comment.userId?.username || 'Unknown'} // Changed op.userId to comment.userId
                    date={comment.createdAt} // Changed op.createdAt to comment.createdAt
                    onReply={user ? () => setReplyingTo(comment._id) : undefined} // Changed op._id to comment._id
                    content={comment.content} // Changed content logic to comment.content
                >
                    {replyingTo === comment._id && ( // Changed op._id to comment._id
                        <div className="mb-4">
                            <CommentForm // Changed OperationForm to CommentForm
                                rootPostId={post!._id}
                                parentId={comment._id} // Changed parentOpId to parentId, op._id to comment._id
                                onCommentAdded={() => setReplyingTo(null)} // Changed onOperationAdded to onCommentAdded
                                onCancel={() => setReplyingTo(null)}
                            />
                        </div>
                    )}
                    {renderTree(comment._id)} {/* Changed op._id to comment._id */}
                </CommentNode>
            </div>
        ));
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading discussion</div>;
    if (!post) return <div className="p-8 text-center">Post not found</div>;

    return (
        <div className="container px-4 py-8 mx-auto max-w-4xl">
            <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Home</Link>
            
            {/* Root Post */}
            <CommentNode
                username={post.userId?.username || 'Unknown'}
                date={post.createdAt}
                onReply={user ? () => setReplyingTo('root') : undefined}
                content={
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h1>
                        <div className="text-gray-800">{post.content}</div>
                    </div>
                }
            >
                {replyingTo === 'root' && (
                    <div className="mb-4">
                        <CommentForm // Changed OperationForm to CommentForm
                            rootPostId={post._id}
                            onCommentAdded={() => setReplyingTo(null)} // Changed onOperationAdded to onCommentAdded
                            onCancel={() => setReplyingTo(null)}
                        />
                    </div>
                )}
                {renderTree(null)}
            </CommentNode>
        </div>
    );
};

export default PostView;
