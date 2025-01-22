import React, { useEffect, useState } from 'react'
import service from '../appwrite/config'
import { json, useLoaderData } from '@remix-run/react'
import parse from 'html-react-parser'
import { Query } from 'appwrite'

export const meta = ({ data }) => {
  const { storie } = data

  return [
    { title: `${storie.title}` },
    {
      name: 'description',
      content: `Explore the insights and perspectives shared by ${storie.username}. Stay informed and updated.`,
    },
    {
      name: 'og:title',
      content: storie.title,
    },
    {
      name: 'og:description',
      content:
        "Discover detailed insights about React's ecosystem and its role in modern web development.",
    },
    {
      name: 'og:image',
      content: service.getFilePreviews(storie.image),
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: storie.title,
    },
    {
      name: 'twitter:description',
      content:
        "Check out this engaging storie about React's unique position as a library and framework.",
    },
    {
      name: 'twitter:image',
      content: service.getFilePreviews(storie.image),
    },
    { name: 'robots', content: 'index,follow' },
    {
      rel: 'canonical',
      href: `https://www.rogblog.me/post/${storie.$id}`,
    },
  ]
}

export async function loader({ params }) {
  const { storyid } = params

  // Handle favicon.ico requests
  if (storyid === 'favicon.ico') {
    return new Response(null, { status: 404 })
  }

  if (!storyid) {
    throw new Response('Id not found', { status: 404 })
  }

  const storie = await service.getStory(storyid)

  if (!storie) {
    throw new Response('Story not found', { status: 404 })
  }

  const storyPosts = await service.getUserAllStoriesPost(storie?.$id, [Query.equal('status', 'active')])

  if (!storyPosts) {
    throw new Response('Story posts not found', { status: 404 })
  }

  return json({ storie, storyPosts: storyPosts.documents })
}

export default function Story() {
  const { storie, storyPosts } = useLoaderData()
  const [selectedPost, setSelectedPost] = useState(storyPosts[0])

  // Automatically set the first post when the component mounts
  useEffect(() => {
    if (storyPosts.length > 0 && !selectedPost) {
      setSelectedPost(storyPosts[0])
    }
  }, [storyPosts, selectedPost])

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col lg:flex-row">
      {/* Sidebar */}
      <div className="bg-gray-800 w-full lg:w-1/4 p-6 space-y-4">
        {/* Story Section */}
        <h2 className="text-2xl font-bold mb-4">Story</h2>
        <div className="bg-gray-700 rounded-lg p-4">
          {storie && (
            <div className="flex justify-start items-center gap-x-6">
              <img
                src={service.getFilePreviews(storie?.image, 64, 64)}
                alt={storie.title}
                className="object-cover rounded-lg"
              />
              <div>
                <span className="font-medium line-clamp-2">
                  {storie.title[0].toUpperCase()}
                  {storie.title.slice(1)}
                </span>
                <span className="text-sm text-gray-400">
                  By {storie.username[0].toUpperCase()}
                  {storie.username.slice(1)}
                </span>
              </div>
            </div>
          )}
        </div>
        {/* Posts Section */}
        <h2 className="text-xl font-bold mb-4">Posts</h2>
        {storyPosts &&
          storyPosts.map((post) => (
            <div
              key={post.$id}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedPost?.$id === post.$id
                  ? 'bg-gray-700'
                  : 'bg-gray-600 hover:bg-gray-500'
              }`}
              onClick={() => setSelectedPost(post)}
            >
              <h3 className="text-md font-medium line-clamp-2">{post.title}</h3>
            </div>
          ))}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {selectedPost ? (
          <div>
            <img
              src={
                selectedPost.image &&
                service.getFilePreviews(selectedPost?.image)
              }
              alt={selectedPost.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
            <div className="mt-5 prose dark:prose-invert overflow-hidden text-xl">
              {parse(selectedPost.content)}
            </div>
          </div>
        ) : (
          <div className="text-gray-400">No post Added</div>
        )}
      </div>
    </div>
  )
}
