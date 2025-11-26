import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl:   `${import.meta.env.VITE_API_URL}/api`, // Hardcoded for now as env var might be missing/different
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Post'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        getRoots: builder.query<any[], void>({
            query: () => '/posts',
            providesTags: ['Post'],
        }),
        getPost: builder.query({
            query: (id: string) => `/posts/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Post', id }],
        }),
        createRoot: builder.mutation({
            query: (data) => ({
                url: '/posts',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Post'],
        }),
        addOperation: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/posts/${id}/operations`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'Post', id }],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetRootsQuery,
    useGetPostQuery,
    useCreateRootMutation,
    useAddOperationMutation,
} = apiSlice;