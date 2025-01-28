import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
//slices
import appReducer from './slices/app'
import authReducer from './slices/auth'
import userReducer from "./slices/user";
import chatReducer from "./slices/chat";
const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-'
}
const rootReducer = combineReducers({
  // create and map reducer
  app: appReducer,
  auth: authReducer,
  user: userReducer,
  chat: chatReducer,
})
export { rootPersistConfig, rootReducer }
