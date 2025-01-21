import React, { useEffect } from 'react'
import { json, useLoaderData, useNavigate } from '@remix-run/react'
import CreateStory from './addStory'
import service from '../appwrite/config'

export const meta = () => {
  const title = 'Edit Post'
  const description = 'Edit an existing story with detailed tools and features.'
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

export async function loader({ params }) {
  const { editStory } = params

  // Handle favicon.ico requests
  if (editStory === 'favicon.ico') {
    return new Response(null, { status: 404 })
  }

  if (!editStory) {
    throw new Response('Id not found', { status: 404 })
  }

  const storie = await service.getStory(editStory)

  if (!storie) {
    throw new Response('Story not found', { status: 404 })
  }

  return json({ storie })
}

function EditStory() {
  const navigate = useNavigate()
  const { storie } = useLoaderData()

  useEffect(() => {
    if (!storie) {
      navigate('/UserProfile')
    }
  }, [storie, navigate])
  return storie.length !== 0 ? (
    <CreateStory story={storie} />
  ) : (
    <div className="text-red-500 font-bold text-2xl text-center">
      {' '}
      Error while Updating. Try in some time later.
    </div>
  )
}

export default EditStory
