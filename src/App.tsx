import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import Auth from './pages/Auth';
import PostView from './pages/PostView';
import { logout } from './features/auth/authSlice';
import { RootState } from './features/store';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/auth');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm">
                <div className="container flex items-center justify-between px-4 py-4 mx-auto">
                    <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">Number Discussions</Link>
                    <div>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-gray-600">Hello, {user.username}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-bold text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link
                                to="/auth"
                                className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none"
                            >
                                Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/posts/:id" element={<PostView />} />
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
