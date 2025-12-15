import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { themeSlice } from './theme/themeSlice';
import { userApi } from './userApi';
import { taskApi } from './taskApi';

export const allApis = [userApi, taskApi];

export const rootReducer = combineReducers({
  [themeSlice.reducerPath]: themeSlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...allApis.map((api) => api.middleware)),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
