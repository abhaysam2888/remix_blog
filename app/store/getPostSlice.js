import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  UpdateArticle: [],
  loading: true,
}

export const getPostSlice = createSlice({
  name: 'getPost',
  initialState,
  reducers: {
    getArticleData: (state, action) => {
      state.UpdateArticle = action.payload
      state.loading = false
    },
  },
})

export const { getArticleData } = getPostSlice.actions

export default getPostSlice.reducer
