import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../axios";

// Создаем асинхронный thunk запрос на получение постов
// вызываем функцию createAsyncThunk
// Даем название posts/fetchPosts
// передаем асинхронную функцию
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (sortBy) => {
        const { data } = await axios.get('/posts' + (sortBy ? `?sort=${sortBy}` : ''));
        return data;
    }
)

export const fetchTags = createAsyncThunk(
    'posts/fetchTags',
    async () => {
        const {data} = await axios.get('/tags')
        return data
    }
)

export const fetchRemovePost = createAsyncThunk(
    'posts/fetchRemovePost',
    async (id) => {
        const {data} = await axios.delete(`/posts/${id}`)
        return data
    }
)

export const fetchPostsByTag = createAsyncThunk('posts/fetchPostsByTag', async ({ tag, sort = 'date' }) => {
    const { data } = await axios.get(`/posts/tag/${tag}?sort=${sort}`);
    return data;
});

// создаем начальное состояние слайса для постов
const initialState = {
    posts: {
        items: [],
        status: 'loading',
        currentSort: 'date' // default sorting
    },
    tags: {
        items: [],
        status: 'loading'
    }
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
//     Нужно отловить запрос на получение постов fetchPosts (pending/fulfilled/rejected) и записать его в state
// Описываем состояние в extraReducers нашего асинхронного thunk экшена
    extraReducers: {
        [fetchPosts.pending]: (state) => {
            state.posts.status = 'loading'
        },
        [fetchPosts.fulfilled]: (state,action) => {
            state.posts.status = 'loaded'
            state.posts.items = action.payload
        },
        [fetchPosts.rejected]: (state) => {
            state.posts.items = []
            state.posts.status = 'error'
        },
        [fetchTags.pending]: (state) => {
            state.tags.status = 'loading'
        },
        [fetchTags.fulfilled]: (state,action) => {
            state.tags.status = 'loaded'
            state.tags.items = action.payload
        },
        [fetchTags.rejected]: (state) => {
            state.tags.items = []
            state.tags.status = 'error'
        },
        [fetchRemovePost.pending]: (state) => {
            state.posts.status = 'loading'
        },
        [fetchRemovePost.fulfilled]: (state,action) => {
            state.posts.items = state.posts.items.filter(obj => obj._id !== action.meta.arg)
            state.posts.status = 'loaded'
        },
        [fetchRemovePost.rejected]: (state) => {
            state.posts.status = 'error'
        },
        // Получение постов по тегу
        [fetchPostsByTag.pending]: (state) => {
            state.posts.items = [];
            state.posts.status = 'loading';
        },
        [fetchPostsByTag.fulfilled]: (state, action) => {
            state.posts.items = action.payload;
            state.posts.status = 'loaded';
        },
        [fetchPostsByTag.rejected]: (state) => {
            state.posts.items = [];
            state.posts.status = 'error';
        },
    }
})

export const postsReducer = postsSlice.reducer
