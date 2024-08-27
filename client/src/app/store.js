import { configureStore } from '@reduxjs/toolkit';

import incidentSlice from '../features/incident-slice';
import userSlice from '../features/user-slice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    incident: incidentSlice,
  },
});

export const getStore = () => store ?? {};
