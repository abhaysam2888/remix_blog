import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import getPostSlice from "./getPostSlice";

export const store = configureStore({
    reducer: {
        auth: authSlice,
        data: getPostSlice,
    },
  })