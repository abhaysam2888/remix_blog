import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userCred: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        login: (state, action) => {
            state.status = true
            state.userCred = action.payload
        },
        logout: (state) => {
            state.status = false
            state.userCred = null
        },
    }

})

export const {  login, logout } = authSlice.actions

export default authSlice.reducer