import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import Auth from './pages/Auth';
import PostView from './pages/PostView';
import { logout } from './features/auth/authSlice';
import { RootState } from './features/store';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

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
                <div className="container flex items-center justify-between px-4 py-2 mx-auto">
                    <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">Discussions forums</Link>
                    <div>
                        {user ? (
                             <Menu as="div" className="relative ml-3">
                  <MenuButton className="relative flex rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-500">
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt=""
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=random&size=128`}
                      className="size-8 rounded-full outline -outline-offset-1 outline-black/5 dark:outline-white/10"
                    />
                  </MenuButton>

                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg outline outline-black/5 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
                  >
               
                      <MenuItem>
                        <button
                        type='button'
                        onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden dark:text-gray-300 dark:data-focus:bg-gray-700"
                        >
                            Sign out
                        </button>
                      </MenuItem>
                  
                  </MenuItems>
                </Menu>
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
