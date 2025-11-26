import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CommentForm from './CommentForm';
import { apiSlice } from '../features/apiSlice';
import authReducer from '../features/auth/authSlice';

// Mock store
const mockStore = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});

describe('CommentForm', () => {
    it('renders correctly', () => {
        render(
            <Provider store={mockStore}>
                <CommentForm rootPostId="root1" onCommentAdded={() => {}} onCancel={() => {}} />
            </Provider>
        );
        expect(screen.getByPlaceholderText('Write a reply...')).toBeInTheDocument();
        expect(screen.getByText('Post Reply')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('updates input value', () => {
        render(
            <Provider store={mockStore}>
                <CommentForm rootPostId="root1" onCommentAdded={() => {}} onCancel={() => {}} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Write a reply...');
        fireEvent.change(input, { target: { value: 'Hello World' } });
        expect(input).toHaveValue('Hello World');
    });
});
