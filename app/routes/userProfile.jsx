import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import service from '../appwrite/config'
import { useNavigate } from '@remix-run/react'
import Button from '../components/Button'

// Meta function for setting meta tags
export const meta = () => {
  return [
    { title: 'User Profile - Manage Your Posts' },
    {
      name: 'description',
      content:
        'View and manage your user profile, including posts and account details',
    },
    { keywords: 'User Profile, Manage Posts, Account Settings' },
    { 'og:title': 'User Profile - Manage Your Posts' },
    {
      'og:description':
        'Easily manage your posts and account details from your user profile page.',
    },
    { 'og:type': 'website' },
    {canonical: "https://www.rogblog.me/UserProfile"},
    {"og:url": "https://www.rogblog.me/UserProfile"},
    {"og:type": "website"},
  ]
}

export default function UserProfile() {
  // Simulating Redux user data
  const userData = useSelector((state) => state.auth.userCred)

  const [posts, setPosts] = useState([])
  const [selectedPosts, setSelectedPosts] = useState([])
  const [status, setStatus] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Toggle Selection of Posts
  const toggleSelectPost = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    )
  }

  // Delete Selected Posts
  const deleteSelectedPosts = async () => {
    setLoading(true)
    const deleteAll = await Promise.all(
      selectedPosts.map(async (item) => {
        const deletePost = await service.deletePost(item)
        if (deletePost) {
          setSelectedPosts((prev) => prev.filter((id) => id !== item))
          setStatus(true)
          setLoading(false)
        } else {
          setStatus(false)
          setLoading(false)
        }
        return deletePost
      })
    )
  }

  const getAllPost = async () => {
    if (userData) {
      const response = await service.getUserAllPosts(userData.$id)
      console.log(response)

      if (response) {
        setPosts([...response.documents])
      }
    }
  }

  useEffect(() => {
    getAllPost()
  }, [status, userData])

  if (userData == null) {
    return (
      <div className="text-white mt-52 text-3xl text-center">
        <p>you are not authorize to access this page.</p>
      </div>
    )
  }

  // loader indicator
  if (loading) {
    return (
      <div className="w-full justify-center flex">
        <div className="loading-container mt-[15%] max-sm:mt-[30%] max-[450px]:mt-[50%]">
          <div className="loading-bar">
            <div className="progress"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="w-full flex justify-center mt-10">
        {/* Input Form */}
        <div className="lg:w-1/2 w-full p-6 shadow-lg">
          <h1 className="text-2xl font-semibold text-white mb-4">
            User Details
          </h1>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Enter name"
                readOnly
                value={(userData && `${userData.name}`) || 'username'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                readOnly
                placeholder="Enter email"
                value={(userData && `${userData.email}`) || 'user email'}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="location">Email verified</Label>
              <Input
                type="text"
                id="location"
                name="location"
                placeholder="Enter location"
                value={
                  (userData && `${userData.emailVerification}`) ||
                  'unable to get'
                }
                readOnly
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring focus:ring-blue-200 focus:outline-none"
              />
            </div>
          </form>
        </div>
      </div>
      {/* Card Component */}
      <div className="mx-auto max-w-6xl p-5">
        <div className="w-full py-5 px-5 border-b mb-5 border-white/[0.6] flex justify-between flex-wrap gap-y-3">
          <h1 className="text-3xl text-white">User Posts</h1>
          {selectedPosts.length > 0 && (
            <Button
              bgColor="bg-red-500"
              className="inline-flex animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              type="submit"
              onClick={deleteSelectedPosts}
            >
              {selectedPosts.length > 1 ? `Delete posts` : `Delete post`}
            </Button>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {posts.length == 0 && (
            <div className="mt-5 text-white text-xl">No post</div>
          )}
          {posts.map((item) => (
            <div
              className="max-w-sm w-full bg-white rounded-lg shadow-md overflow-hidden mt-10 gap-x-10 relative"
              key={item.$id}
              onClick={() => navigate(`/editPost/${item.$id}`)}
            >
              <img
                src={service.getFilePreviews(item.image)}
                alt="Cow Image"
                className="w-full h-48 object-cover"
              />
              <Input
                type="checkbox"
                checked={selectedPosts.includes(item.$id)}
                onChange={() => toggleSelectPost(item.$id)}
                onClick={(e) => e.stopPropagation()}
                className="absolute bg-black top-3 right-3 h-5 w-5"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
