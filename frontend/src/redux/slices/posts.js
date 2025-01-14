import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../axios";

// Создаем асинхронный thunk запрос на получение постов
// вызываем функцию createAsyncThunk
// Даем название posts/fetchPosts
// передаем асинхронную функцию
export const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async () => {
        const {data} = await axios.get('/posts')
        return data
    }
)

export const fetchTags = createAsyncThunk(
    'posts/fetchTags',
    async () => {
        const {data} = await axios.get('/tags')
        return data
    }
)

// создаем начальное состояние слайса для постов
const initialState = {
    posts: {
        items: [],
        status: 'loading'
    },
    tags: {
        items: [],
        status: 'loading'
    }
}

const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {},
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

    }
})

export const postsReducer = postsSlice.reducer
