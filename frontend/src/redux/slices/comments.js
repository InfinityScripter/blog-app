import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../axios';

export const fetchComments = createAsyncThunk(
    'comments/fetchComments',
    async (postId) => {
        const { data } = await axios.get(`/posts/${postId}/comments`);
        return data;
    }
);

export const createComment = createAsyncThunk(
    'comments/createComment',
    async ({ postId, text }) => {
        const { data } = await axios.post(`/posts/${postId}/comments`, { text });
        return data;
    }
);

export const updateComment = createAsyncThunk(
    'comments/updateComment',
    async ({ postId, id, text }) => {
        const { data } = await axios.patch(`/posts/${postId}/comments/${id}`, { text });
        return { postId, id, text };
    }
);

export const deleteComment = createAsyncThunk(
    'comments/deleteComment',
    async ({ postId, id }) => {
        await axios.delete(`/posts/${postId}/comments/${id}`);
        return { postId, id };
    }
);

export const getLastComments = createAsyncThunk(
    'comments/getLastComments',
    async () => {
        const { data } = await axios.get('/posts/comments');
        return data;
    }
);

const initialState = {
    items: [],
    status: 'loaded'
};

const commentsSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {},
    extraReducers: {
        // Получение комментариев
        [fetchComments.pending]: (state) => {
            state.items = [];
            state.status = 'loading';
        },
        [fetchComments.fulfilled]: (state, action) => {
            state.items = action.payload;
            state.status = 'loaded';
        },
        [fetchComments.rejected]: (state) => {
            state.items = [];
            state.status = 'error';
        },
        // Создание комментария
        [createComment.pending]: (state) => {
            state.status = 'loading';
        },
        [createComment.fulfilled]: (state, action) => {
            state.items.unshift(action.payload);
            state.status = 'loaded';
        },
        [createComment.rejected]: (state) => {
            state.status = 'error';
        },
        // Обновление комментария
        [updateComment.pending]: (state) => {
            state.status = 'loading';
        },
        [updateComment.fulfilled]: (state, action) => {
            const { id, text } = action.payload;
            const index = state.items.findIndex(comment => comment._id === id);
            if (index !== -1) {
                state.items[index].text = text;
            }
            state.status = 'loaded';
        },
        [updateComment.rejected]: (state) => {
            state.status = 'error';
        },
        // Удаление комментария
        [deleteComment.pending]: (state) => {
            state.status = 'loading';
        },
        [deleteComment.fulfilled]: (state, action) => {
            state.items = state.items.filter(comment => comment._id !== action.payload.id);
            state.status = 'loaded';
        },
        [deleteComment.rejected]: (state) => {
            state.status = 'error';
        },
        // Получение последних комментариев
        [getLastComments.pending]: (state) => {
            state.items = [];
            state.status = 'loading';
        },
        [getLastComments.fulfilled]: (state, action) => {
            state.items = action.payload;
            state.status = 'loaded';
        },
        [getLastComments.rejected]: (state) => {
            state.items = [];
            state.status = 'error';
        },
    },
});

export const commentsReducer = commentsSlice.reducer;
