import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import NewPostForm from '../components/NewPostForm';
import { useGetTreeQuery } from '../features/apiSlice';
import { RootState } from '../features/store';

const Home: React.FC = () => {
    const { data: posts = [], isLoading, error } = useGetTreeQuery();
    const user = useSelector((state: RootState) => state.auth.user);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading posts</div>;

    return (
        <div className="container px-4 py-8 mx-auto">
            <div className="flex justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Discussions</h1>
                {user && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-2 text-sm font-bold text-white bg-green-500 rounded hover:bg-green-700"
                    >
                        Create Post
                    </button>
                )}
            </div>
          
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
            {user && <NewPostForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />}
            {!user && (
                <p className="mt-8 text-center text-gray-600">
                    <Link to="/auth" className="text-blue-500 hover:underline">Login</Link> to create a post.
                </p>
            )}
        </div>
    );
};

export default Home;
