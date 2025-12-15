import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { themeSlice } from '@/store/theme/themeSlice';
import { userApi } from '@/store/userApi/userApi';

export const rootReducer = combineReducers({
  [themeSlice.reducerPath]: themeSlice.reducer,
  [userApi.reducerPath]: userApi.reducer,
});

export function setupStore(preloadedState?: Partial<ReturnType<typeof rootReducer>>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(userApi.middleware),
  });
}
