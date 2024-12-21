import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    articles: [],
    UpdateArticle: [],
    documentId: "",
    loading: true,
}

export const getPostSlice = createSlice({
    name: "getPost",
    initialState,
    reducers: {
        getArticlesData: (state, action) => {
            state.articles = action.payload
            state.loading = false
        },
        getArticleData: (state, action) => {
            state.UpdateArticle = action.payload
            state.loading = false
        },
        getSlug: (state, action) => {
            state.loading = false
            console.log(action.payload);
            localStorage.setItem('slug', action.payload)
            state.documentId = action.payload
        }
    }
})


export const {  getArticlesData, getArticleData, getSlug } = getPostSlice.actions

export default getPostSlice.reducer