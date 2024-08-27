import { createSlice } from '@reduxjs/toolkit';

import {
  adminLoginThunk,
  currentUserThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
  resetPasswordThunk,
} from './users/user-thunks';

const initialState = {
  user: null,
  isWorking: false,
  errorMessage: '',
  registerStatus: 'idle',
  resetPasswordStatus: 'idle',
  loginStatus: 'idle',
  adminLoginStatus: 'idle',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.user = action.payload;
    },
    setIsWorking: (state, action) => {
      state.isWorking = action.payload;
    },
    setIsInitDone: (state, action) => {
      state.isInitDone = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    resetAuthState: (state) => {
      state.isWorking = false;
      state.errorMessage = '';
      state.registerStatus = 'idle';
      state.resetPasswordStatus = 'idle';
      state.loginStatus = 'idle';
      state.adminLoginStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.errorMessage = '';
        state.isWorking = false;
        state.registerStatus = 'success';
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isWorking = false;
        state.registerStatus = 'failure';
        state.errorMessage = action.payload;
      })
      .addCase(loginThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.errorMessage = '';
        state.isWorking = false;
        state.loginStatus = 'success';
        state.user = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.adminLoginStatus = 'failure';
        state.isWorking = false;
        state.errorMessage = action.payload;
      })
      .addCase(adminLoginThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action) => {
        state.errorMessage = '';
        state.isWorking = false;
        state.adminLoginStatus = 'success';
        state.user = action.payload.data;
        state.token = action.payload.token;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loginStatus = 'failure';
        state.isWorking = false;
        state.errorMessage = action.payload;
      })
      .addCase(resetPasswordThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(resetPasswordThunk.fulfilled, (state, action) => {
        state.isWorking = false;
        state.resetPasswordStatus = 'success';
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        console.log('::::payload', action.payload);
        state.resetPasswordStatus = 'failure';
        state.isWorking = false;
        state.errorMessage = action.payload;
      })
      .addCase(currentUserThunk.rejected, (state, action) => {
        state.isWorking = false;
        state.errorMessage = action.payload;
      })
      .addCase(currentUserThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(currentUserThunk.fulfilled, (state, action) => {
        state.isWorking = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isWorking = true;
        state.errorMessage = action.payload;
        state.loginStatus = 'idle';
      })
      .addCase(logoutThunk.pending, (state) => {
        state.isWorking = false;
      })
      .addCase(logoutThunk.fulfilled, (state, action) => {
        state.isWorking = false;
        state.user = null;
        state.errorMessage = '';
        state.registerStatus = 'idle';
        state.resetPasswordStatus = 'idle';
        state.loginStatus = 'idle';
      });
  },
});

export const { setCurrentUser, setIsWorking, setIsInitDone, resetAuthState } = userSlice.actions;

export default userSlice.reducer;
