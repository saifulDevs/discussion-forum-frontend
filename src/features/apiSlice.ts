import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export interface User {
    id: string;
    username: string;
}

export interface RootPost {
    _id: string;
    title: string;
    content: string;
    userId: User;
    createdAt: string;
}

export interface Comment {
    _id: string;
    rootPostId: string;
    parentId?: string;
    userId: User;
    content: string;
    createdAt: string;
}

export interface PostResponse {
    post: RootPost;
    comments: Comment[];
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: `${import.meta.env.VITE_API_URL}/api`,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Post', 'RootPosts'],
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string; user: User }, any>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation<{ token: string; user: User }, any>({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        getRoots: builder.query<RootPost[], void>({
            query: () => '/posts',
            providesTags: ['RootPosts'],
        }),
        getPost: builder.query<PostResponse, string>({
            query: (id) => `/posts/${id}`,
            providesTags: (result, error, id) => [{ type: 'Post', id }],
        }),
        createRoot: builder.mutation<RootPost, { title: string; content: string }>({
            query: (body) => ({
                url: '/posts',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['RootPosts'],
        }),
        addComment: builder.mutation<Comment, { id: string; parentId?: string; content: string }>({
            query: ({ id, ...body }) => ({
                url: `/posts/${id}/comments`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Post', id }],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetRootsQuery,
    useGetPostQuery,
    useCreateRootMutation,
    useAddCommentMutation,
} = apiSlice;