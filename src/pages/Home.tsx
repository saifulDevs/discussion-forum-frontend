import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import NewPostForm from '../components/NewPostForm';

const Home: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const user = localStorage.getItem('user');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const { data } = await api.get('/posts');
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handlePostCreated = (newPost: any) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <div className="container px-4 py-8 mx-auto">
            <h1 className="mb-8 text-3xl font-bold text-center text-gray-900">Number Discussions</h1>
            {user ? (
                <NewPostForm onPostCreated={handlePostCreated} />
            ) : (
                <p className="mb-8 text-center text-gray-600">
                    <Link to="/auth" className="text-blue-500 hover:underline">Login</Link> to create a post.
                </p>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <div key={post._id} className="p-6 transition-shadow bg-white rounded-lg shadow hover:shadow-lg">
                        <h3 className="mb-2 text-xl font-bold text-gray-800">
                            Starting Number: {post.startNumber}
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
