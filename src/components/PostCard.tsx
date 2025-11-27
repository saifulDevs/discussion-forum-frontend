import React from 'react';
import { Link } from 'react-router-dom';
import { ComputationNode, useDeleteNodeMutation } from '../features/apiSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';

interface PostCardProps {
    post: ComputationNode;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const [deleteNode, { isLoading: isDeleting }] = useDeleteNodeMutation();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this computation? This will delete all related nodes.')) {
            try {
                await deleteNode(post._id).unwrap();
            } catch (err) {
                console.error('Failed to delete the post: ', err);
            }
        }
    };

    return (
        <div className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-lg">
            <h3 className="mb-2 text-3xl font-bold text-gray-800">
              {post.value}
            </h3>
            <div className="mb-4 text-lg text-gray-600">
                <img  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(post.userId?.username)}&background=random&size=128`} alt='user icon' className='size-8 rounded-full outline -outline-offset-1 outline-black/5 dark:outline-white/10'/>
            <p className="mb-4 text-sm text-gray-600">Started by: {post.userId?.username || 'Unknown'}</p>
            </div>
           
            
                <div className="flex justify-end mt-4 space-x-2">
                     <Link
                to={`/posts/${post._id}`}
                className="inline-block px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
                View Computation
            </Link>
            {user && user.id === post.userId?._id && (
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded hover:bg-red-700 disabled:bg-gray-400"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                     )}
                </div>
           
        </div>
    );
};

export default PostCard;
