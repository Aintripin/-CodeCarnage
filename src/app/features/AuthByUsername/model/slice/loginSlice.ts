import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginSchema } from '../types/loginSchema';

const initialState: LoginSchema = {
    isLoading: false,
    username: '',
    password: '',
};

export const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUsername: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        setPassword: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginByUsername.pending, (state, action) => {
                if (state.loading === 'idle') {
                    state.loading = 'pending';
                    state.currentRequestId = action.meta.requestId;
                }
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                const { requestId } = action.meta;
                if (
                    state.loading === 'pending' &&
                    state.currentRequestId === requestId
                ) {
                    state.loading = 'idle'
                    state.entities.push(action.payload)
                    state.currentRequestId = undefined
                }
            })
            .addCase(loginByUsername.rejected, (state, action) => {
                const { requestId } = action.meta;
                if (
                    state.loading === 'pending' &&
                )
            })
    }
});

export const { actions: loginActions } = loginSlice;
export const { reducer: loginReducer } = loginSlice;
