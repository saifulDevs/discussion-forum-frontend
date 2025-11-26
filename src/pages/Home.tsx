import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import NewPostForm from '../components/NewPostForm';
import { useGetRootsQuery } from '../features/apiSlice';
import { RootState } from '../features/store';

const Home: React.FC = () => {
    const { data: posts = [], isLoading, error } = useGetRootsQuery();
    const user = useSelector((state: RootState) => state.auth.user);

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error loading posts</div>;

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-8 text-3xl font-bold text-center text-gray-900">Number Discussions</h1>
            {user ? (
                <NewPostForm onPostCreated={() => {}} /> // RTK Query handles cache invalidation
            ) : (
                <p className="mb-8 text-center text-gray-600">
                    <Link to="/auth" className="text-blue-500 hover:underline">Login</Link> to create a post.
                </p>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <div key={post._id} className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-lg">
                        <h3 className="mb-2 text-xl font-bold text-gray-800">
                            Title: {post.title}
                        </h3>
                        <p className="mb-4 text-sm text-gray-600">Posted by: {post.userId?.username || 'Unknown'}</p>
                        <Link
                            to={`/posts/${post._id}`}
                            className="inline-block px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
                        >
                            View Discussion
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
