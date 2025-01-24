import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
//slices
import appReducer from './slices/app'
import authReducer from './slices/auth'
const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-'
}
const rootReducer = combineReducers({
  // create and map reducer
  app: appReducer,
  auth: authReducer
})
export { rootPersistConfig, rootReducer }
