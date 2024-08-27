import { createAsyncThunk } from '@reduxjs/toolkit';

import { API } from '../../services/api';

export const createIncidentThunk = createAsyncThunk('incident/createIncident', async (createIncidentData, thunkApi) => {
  try {
    const response = await API.post(`api/incidents`, createIncidentData);

    return response.data;
  } catch (error) {
    if (error.status < 500) {
      return thunkApi.rejectWithValue(error.errorMessage);
    } else {
      return thunkApi.rejectWithValue('Something went wrong, please try again later');
    }
  }
});

export const incidentThunk = createAsyncThunk('incident/fetchIncident', async ({ id }, thunkApi) => {
  try {
    const response = await API.get(`api/incidents/${id}`);

    return response.data;
  } catch (error) {
    if (error.status < 500) {
      return thunkApi.rejectWithValue(error.errorMessage);
    } else {
      return thunkApi.rejectWithValue('Something went wrong, please try again later');
    }
  }
});

export const updateIncidentThunk = createAsyncThunk('incident/updateIncident', async ({ id, data }, thunkApi) => {
  try {
    const response = await API.patch(`api/incidents/${id}`, data);

    return response.data;
  } catch (error) {
    if (error.status < 500) {
      return thunkApi.rejectWithValue(error.errorMessage);
    } else {
      return thunkApi.rejectWithValue('Something went wrong, please try again later');
    }
  }
});

export const updateIncidentStatusThunk = createAsyncThunk(
  'incident/updateIncidentStatus',
  async ({ id, data }, thunkApi) => {
    try {
      const response = await API.patch(`api/incidents/${id}`, data);

      return response.data;
    } catch (error) {
      if (error.status < 500) {
        return thunkApi.rejectWithValue(error.errorMessage);
      } else {
        return thunkApi.rejectWithValue('Something went wrong, please try again later');
      }
    }
  }
);

export const assignIncidentToStaffThunk = createAsyncThunk(
  'incident/assignIncident',
  async ({ id, data }, thunkApi) => {
    try {
      const response = await API.patch(`api/incidents/assign/${id}`, data);

      return response.data;
    } catch (error) {
      if (error.status < 500) {
        return thunkApi.rejectWithValue(error.errorMessage);
      } else {
        return thunkApi.rejectWithValue('Something went wrong, please try again later');
      }
    }
  }
);

export const deleteIncidentThunk = createAsyncThunk('incident/deleteIncident', async ({ id }, thunkApi) => {
  try {
    const response = await API.delete(`api/incidents/${id}`);

    return response.data;
  } catch (error) {
    if (error.status < 500) {
      return thunkApi.rejectWithValue(error.errorMessage);
    } else {
      return thunkApi.rejectWithValue('Something went wrong, please try again later');
    }
  }
});

export const incidentsThunk = createAsyncThunk('incident/fetchIncidents', async (_, thunkApi) => {
  try {
    const response = await API.get(`api/incidents`);

    return response.data;
  } catch (error) {
    if (error.status < 500) {
      return thunkApi.rejectWithValue(error.errorMessage);
    } else {
      return thunkApi.rejectWithValue('Something went wrong, please try again later');
    }
  }
});
