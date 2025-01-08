import storage from 'redux-persist/lib/storage'
import { combineReducers } from '@reduxjs/toolkit'
//slices
import appReducer from './slices/app'
const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-'
}
const rootReducer = combineReducers({
  // create and map reducer
  app: appReducer
})
export { rootPersistConfig, rootReducer }
