import React, { useEffect } from 'react'
import AddPost from './AddPost'
import { useNavigate, useParams } from '@remix-run/react'
import { useSelector } from 'react-redux'
import useArticleFetch from '../customHook/useArticleFetch'

export const meta = () => {
  const title = 'Edit Post'
  const description = 'Edit an existing post with detailed tools and features.'
  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:type', content: 'article' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'robots', content: 'index,follow' },
  ]
}

function EditPost() {
  const { editPost } = useParams()
  const navigate = useNavigate()
  if (editPost) useArticleFetch(editPost)
  const post = useSelector((state) => state.data.UpdateArticle)

  useEffect(() => {
    if (!editPost) {
      navigate('/')
    }
  }, [editPost, navigate])
  return post.length !== 0 ? <AddPost post={post} /> : null
}

export default EditPost
