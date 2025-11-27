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
                <CommentForm parentId="root1" onReplyAdded={() => {}} onCancel={() => {}} />
            </Provider>
        );
        expect(screen.getByPlaceholderText('Enter a number')).toBeInTheDocument();
        expect(screen.getByText('Add Reply')).toBeInTheDocument();
        expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('updates input value', () => {
        render(
            <Provider store={mockStore}>
                <CommentForm parentId="root1" onReplyAdded={() => {}} onCancel={() => {}} />
            </Provider>
        );

        const input = screen.getByPlaceholderText('Enter a number');
        fireEvent.change(input, { target: { value: '123' } });
        expect(input).toHaveValue(123);
    });
});
