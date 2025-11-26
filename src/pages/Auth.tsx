import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation, useRegisterMutation } from '../features/apiSlice';
import { setCredentials } from '../features/auth/authSlice';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading: isLoginLoading }] = useLoginMutation();
    const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const credentials = { username, password };
            const userData = isLogin 
                ? await login(credentials).unwrap() 
                : await register(credentials).unwrap();

            dispatch(setCredentials(userData));
            navigate('/');
        } catch (error) {
            console.error('Authentication failed:', error);
            alert('Authentication failed');
        }
    };

    const isLoading = isLoginLoading || isRegisterLoading;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    {isLogin ? 'Login' : 'Register'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full px-4 py-2 font-bold text-white rounded focus:outline-none focus:shadow-outline ${
                            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700'
                        }`}
                    >
                        {isLoading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;
