import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk(
    'auth/fetchAuth',
    async (params) => {
        // Делаем post запрос и передаем параметры email и password
        const {data} = await axios.post('/auth/login', params)
        return data
    }
)

export const fetchRegister = createAsyncThunk(
    'auth/fetchRegister',
    async (params) => {
        // Делаем post запрос и передаем параметры email и password
        const {data} = await axios.post('/auth/register', params)
        return data
    }
)


export const fetchAuthMe = createAsyncThunk(
    'auth/fetchAuthMe',
    async () => {
        const {data} = await axios.get('/auth/me')
        return data
    }
)

const initialState = {
    isAuth: false,
    data: null,
    status: 'loading'
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null
            state.isAuth = false
        }
    },
    extraReducers: {
        [fetchAuth.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchAuth.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
            state.isAuth = true
        },
        [fetchAuth.rejected]: (state) => {
            state.status = 'error'
            state.data = null
            state.isAuth = false
        },

        [fetchAuthMe.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchAuthMe.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
            state.isAuth = true
        },
        [fetchAuthMe.rejected]: (state) => {
            state.status = 'error'
            state.data = null
            state.isAuth = false
        },
        [fetchRegister.pending]: (state) => {
            state.status = 'loading'
            state.data = null
        },
        [fetchRegister.fulfilled]: (state, action) => {
            state.status = 'loaded'
            state.data = action.payload
        },
        [fetchRegister.rejected]: (state) => {
            state.status = 'error'
            state.data = null
        }
    }
})

// Проверка на авторизацию
export const selectIsAuth = (state) => state.auth.isAuth

export const authReducer = authSlice.reducer

export const {logout} = authSlice.actions
