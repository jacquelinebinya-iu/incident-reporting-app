import { createSlice } from '@reduxjs/toolkit';

import {
  assignIncidentToStaffThunk,
  createIncidentThunk,
  deleteIncidentThunk,
  incidentsThunk,
  incidentThunk,
  updateIncidentStatusThunk,
  updateIncidentThunk,
} from './incidents/incident-thunks';

const initialState = {
  incident: null,
};

export const incidentSlice = createSlice({
  name: 'incident',
  initialState,
  reducers: {
    setIsWorking: (state, action) => {
      state.isWorking = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createIncidentThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(createIncidentThunk.fulfilled, (state, action) => {
        console.log('🟣🟣🟣🟣🟣🟣', action.payload);
        state.errorMessage = '';
        state.isWorking = false;
        state.incident = action.payload;
      })
      .addCase(createIncidentThunk.rejected, (state, action) => {
        state.isWorking = false;
        state.errorMessage = action.payload;
      })
      .addCase(updateIncidentThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(updateIncidentThunk.fulfilled, (state, action) => {
        console.log('🟣🟣🟣🟣🟣🟣', action.payload);
        state.errorMessage = '';
        state.isWorking = false;
        state.incident = action.payload;
      })
      .addCase(updateIncidentThunk.rejected, (state, action) => {
        state.isWorking = false;
        state.errorMessage = action.payload;
      })
      .addCase(deleteIncidentThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(deleteIncidentThunk.fulfilled, (state, action) => {
        console.log('🟣🟣🟣🟣🟣🟣', action.payload);
        state.errorMessage = '';
        state.isWorking = false;
        state.incident = action.payload;
      })
      .addCase(deleteIncidentThunk.rejected, (state, action) => {
        state.isWorking = false;
        state.errorMessage = action.payload;
      })
      .addCase(incidentThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(incidentThunk.fulfilled, (state, action) => {
        console.log('🟣🟣🟣🟣🟣🟣', action.payload);
        state.errorMessage = '';
        state.isWorking = false;
        state.incident = action.payload;
      })
      .addCase(incidentThunk.rejected, (state, action) => {
        state.isWorking = false;
        state.errorMessage = action.payload;
      })

      .addCase(incidentsThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(incidentsThunk.fulfilled, (state, action) => {
        console.log('🟣🟣🟣🟣🟣🟣', action.payload);
        state.errorMessage = '';
        state.isWorking = false;
        state.incident = action.payload;
      })
      .addCase(incidentsThunk.rejected, (state, action) => {
        state.isWorking = false;
        state.errorMessage = action.payload;
      })
      .addCase(assignIncidentToStaffThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(assignIncidentToStaffThunk.fulfilled, (state, action) => {
        console.log('🟣🟣🟣🟣🟣🟣', action.payload);
        state.errorMessage = '';
        state.isWorking = false;
        state.incident = action.payload;
      })
      .addCase(assignIncidentToStaffThunk.rejected, (state, action) => {
        state.isWorking = false;
        state.errorMessage = action.payload;
      })
      .addCase(updateIncidentStatusThunk.pending, (state) => {
        state.isWorking = true;
      })
      .addCase(updateIncidentStatusThunk.fulfilled, (state, action) => {
        console.log('🟣🟣🟣🟣🟣🟣', action.payload);
        state.errorMessage = '';
        state.isWorking = false;
        state.incident = action.payload;
      })
      .addCase(updateIncidentStatusThunk.rejected, (state, action) => {
        state.isWorking = false;
        state.errorMessage = action.payload;
      });
  },
});

export const { setIsWorking } = incidentSlice.actions;

export default incidentSlice.reducer;
