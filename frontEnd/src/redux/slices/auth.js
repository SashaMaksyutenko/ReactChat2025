/* eslint-disable no-unused-vars */
import { createSlice } from '@reduxjs/toolkit'
import axios from '../../utils/axios'
const initialState = {
  isLoading: false,
  error: null,
  token: null,
  user: {},
  isLoggedIn: false
}
const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError (state, action) {
      state.error = action.payload
    },
    setLoading (state, action) {
      state.isLoading = action.payload
    }
  }
})
export default slice.reducer
const { setError, setLoading } = slice.actions
// register user
export function RegisterUser (formData) {
  return async (dispatch, getState) => {
    dispatch(setError(null))
    dispatch(setLoading(true))
    const reqBody = { ...formData }
    // Make API CALL
    await axios
      .post('/auth/signup', reqBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error)
        dispatch(setError(error))
      })
      .finally(() => {
        dispatch(setLoading(false))
      })
  }
}
