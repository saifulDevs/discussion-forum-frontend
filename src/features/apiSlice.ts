import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export interface User {
    id: string;
    username: string;
}

export type Operation = '+' | '-' | '*' | '/';

export interface ComputationNode {
    _id: string;
    parentId: string | null;
    operation: Operation | null;
    rightNumber: number | null;
    value: number;
    userId: User;
    createdAt: string;
    children: ComputationNode[];
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
    tagTypes: ['Node'],
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
        getTree: builder.query<ComputationNode[], void>({
            query: () => '/nodes',
            providesTags: (result) =>
                result
                    ? [...result.map(({ _id }) => ({ type: 'Node' as const, id: _id })), { type: 'Node', id: 'LIST' }]
                    : [{ type: 'Node', id: 'LIST' }],
        }),
        getNode: builder.query<ComputationNode, string>({
            query: (id) => `/nodes/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Node', id }],
        }),
        createRoot: builder.mutation<ComputationNode, { value: number }>({
            query: (body) => ({
                url: '/nodes',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Node', id: 'LIST' }],
        }),
        createReply: builder.mutation<
            ComputationNode,
            { parentId: string; operation: Operation; rightNumber: number }
        >({
            query: ({ parentId, ...body }) => ({
                url: `/nodes/${parentId}`,
                method: 'POST',
                body,
            }),
            invalidatesTags: (_result, _error, { parentId }) => [{ type: 'Node', id: parentId }],
        }),
        deleteNode: builder.mutation<void, string>({
            query: (id) => ({
                url: `/nodes/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: 'Node', id: 'LIST' }, { type: 'Node', id }],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetTreeQuery,
    useGetNodeQuery,
    useCreateRootMutation,
    useCreateReplyMutation,
    useDeleteNodeMutation,
} = apiSlice;