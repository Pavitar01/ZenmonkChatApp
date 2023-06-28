import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import UserSlice from './Slice/UserSlice';

const persistConfig = {
  key: 'userdata',
  storage,
  blacklist: [],
};

const rootReducer = combineReducers({
  userData: UserSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
