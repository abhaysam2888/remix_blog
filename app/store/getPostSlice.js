import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  UpdateArticle: [],
  documentId: '',
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
    getSlug: (state, action) => {
      state.loading = false
      localStorage.setItem('slug', action.payload)
      state.documentId = action.payload
    },
  },
})

export const { getArticleData, getSlug } = getPostSlice.actions

export default getPostSlice.reducer
