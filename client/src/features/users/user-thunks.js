import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { API_PATH } from '../../constants/index';
import { API } from '../../services/api';

const pathify = (path) => {
  if (path === '/') {
    return API_PATH;
  }
  const url = new URL(path, API_PATH);
  return url.href;
};

export const registerThunk = createAsyncThunk('user/registerUser', async (registerData, thunkApi) => {
  try {
    const response = await axios.post(pathify('api/auth/register'), registerData);
    if (response.data.token) {
      localStorage.setItem('IRA_ACCESS_TOKEN', response.data.token);
    }

    return {
      data: response.data.data,
    };
  } catch (error) {
    console.log(error);
    if (error.response.status < 500) {
      return thunkApi.rejectWithValue(error.response.data.errorMessage);
    } else {
      return thunkApi.rejectWithValue('Something went wrong, please try again later');
    }
  }
});

export const resetPasswordThunk = createAsyncThunk('user/resetPassword', async (resetPasswordData, thunkApi) => {
  try {
    const response = await axios.post(pathify('api/auth/reset-password'), resetPasswordData);

    return {
      data: response.data.data,
    };
  } catch (error) {
    console.log(error);
    if (error.response.status < 500) {
      return thunkApi.rejectWithValue(error.response.data.errorMessage);
    } else {
      return thunkApi.rejectWithValue('Something went wrong, please try again later');
    }
  }
});

export const loginThunk = createAsyncThunk('user/login', async (loginData, thunkApi) => {
  try {
    const response = await axios.post(pathify('api/auth/login'), loginData);

    if (response.data.token) {
      localStorage.setItem('IRA_ACCESS_TOKEN', response.data.token);
    }

    return {
      data: response.data.data,
    };
  } catch (error) {
    console.log(error);
    if (error.response.status < 500) {
      return thunkApi.rejectWithValue(error.response.data.errorMessage);
    } else {
      return thunkApi.rejectWithValue('Something went wrong, please try again later');
    }
  }
});

export const adminLoginThunk = createAsyncThunk('user/admin/login', async (loginData, thunkApi) => {
  try {
    const response = await axios.post(pathify('api/admin/login'), loginData);

    if (response.data.token) {
      localStorage.setItem('IRA_ACCESS_TOKEN', response.data.token);
    }

    return {
      data: response.data.data,
    };
  } catch (error) {
    console.log(error);
    if (error.response.status < 500) {
      return thunkApi.rejectWithValue(error.response.data.errorMessage);
    } else {
      return thunkApi.rejectWithValue('Something went wrong, please try again later');
    }
  }
});

export const currentUserThunk = createAsyncThunk('auth/currentUser', async (_, thunkAPI) => {
  try {
    const response = await API.get('api/current');

    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.errorMessage);
  }
});

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('IRA_ACCESS_TOKEN');
});
