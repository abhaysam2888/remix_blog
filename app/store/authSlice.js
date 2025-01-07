import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: false,
  userCred: null,
  rawDatas: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true
      state.userCred = action.payload
    },
    logout: (state) => {
      state.status = false
      state.userCred = null
      state.rawDatas = null
    },
    rawData: (state, action) => {
      state.rawDatas = action.payload
    },
  },
})

export const { login, logout, rawData } = authSlice.actions

export default authSlice.reducer
