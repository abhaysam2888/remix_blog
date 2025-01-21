import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import service from '../appwrite/config'
import { Link, useNavigate } from '@remix-run/react'
import Button from '../components/Button'
import authService from '../appwrite/auth'
import { logout } from '../store/authSlice.js'

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
    { name: 'og:title', content: 'User Profile - Manage Your Posts' },
    {
      name: 'og:description',
      content:
        'Easily manage your posts and account details from your user profile page.',
    },
    { name: 'og:type', content: 'website' },
    { name: 'canonical', content: 'https://www.rogblog.me/UserProfile' },
    { name: 'og:url', content: 'https://www.rogblog.me/UserProfile' },
  ]
}

export default function UserProfile() {
  // Simulating Redux user data
  const userData = useSelector((state) => state.auth.userCred)

  const [posts, setPosts] = useState([])
  const [seePost, setSeePost] = useState(true)
  const [stories, setStories] = useState([])
  const [seeStories, setSeeStories] = useState(false)
  const [selectedPosts, setSelectedPosts] = useState([])
  const [selectedStories, setSelectedStories] = useState([])
  const [status, setStatus] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  // Toggle Selection of Posts
  const toggleSelectPost = ({ postId, imageId }) => {
    setSelectedPosts((prev) =>
      prev.some((item) => item.postId === postId && item.imageId === imageId)
        ? prev.filter(
            (item) => !(item.postId === postId && item.imageId === imageId)
          )
        : [...prev, { postId, imageId }]
    )
  }

  // Toggle Selection of stories
  const toggleSelectStory = ({ storyId, imageId }) => {
    setSelectedStories((prev) =>
      prev.some((item) => item.storyId === storyId && item.imageId === imageId)
        ? prev.filter(
            (item) => !(item.storyId === storyId && item.imageId === imageId)
          )
        : [...prev, { storyId, imageId }]
    )
  }

  // Delete Selected Posts and stories
  const deleteSelectedPosts = async () => {
    setLoading(true)
    // Delete Posts
    if (seePost) {
      const deleteAll = await Promise.all(
        selectedPosts.map(async (item) => {
          const deletePost = await service.deletePost(item.postId)
          if (deletePost) {
            const deleteFile = await service.deleteFile(item?.imageId)
            if (deleteFile) {
              setSelectedPosts((prev) => prev.filter((id) => id !== item))
              setStatus(true)
              setLoading(false)
            }
          } else {
            setStatus(false)
            setLoading(false)
          }
          return deletePost
        })
      )
    }
    // Delete stories
    if (seeStories) {
      const deleteAll = await Promise.all(
        selectedStories.map(async (item) => {
          const deleteStories = await service.deleteStory(item.storyId)
          if (deleteStories) {
            const deleteFile = await service.deleteFile(item?.imageId)
            if (deleteFile) {
              setSelectedStories((prev) => prev.filter((id) => id !== item))
              setStatus(true)
              setLoading(false)
            }
          } else {
            setStatus(false)
            setLoading(false)
          }
          return deleteStories
        })
      )
    }
  }

  const getAllPost = async () => {
    if (userData) {
      const response = await service.getUserAllPosts(userData.$id)
      if (response) {
        setPosts([...response.documents])
      }
    }
  }

  // get user all stories
  const getAllStories = async () => {
    if (userData) {
      const response = await service.getUserAllStories(userData.$id)
      if (response) {
        setStories([...response.documents])
      }
    }
  }

  const handelClick = async () => {
    try {
      const logouts = await authService.logout()

      if (logouts) {
        dispatch(logout())
      }
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  const handelSeePost = () => {
    setSeePost(true)
    setSeeStories(false)
  }

  const handelSeeStories = () => {
    setSeePost(false)
    setSeeStories(true)
  }

  useEffect(() => {
    getAllPost()
    getAllStories()
  }, [status, userData])

  const handleFormSubmit = (e) => {
    e.preventDefault()
  }

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
          <form className="space-y-4" onSubmit={handleFormSubmit}>
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
            <Button
              bgColor="bg-red-500"
              className="inline-flex animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              onClick={handelClick}
            >
              Logout
            </Button>
          </form>
        </div>
      </div>
      {/* user preferences */}
      {userData.prefs.profileStory && (
        <div className="text-center mt-[20px] text-white text-lg">
          <h2>Want to Write Stories?</h2>
          <p className="mb-5">
            Unleash your creativity and share your stories with the world. Click
            below to start writing!
          </p>
          <Link to="/addStory">
            <button
              className="py-[10px] px-[20px] text-white border-none rounded-[5px] cursor-pointer bg-[#ff4500]"
              onClick={() => authService.updatePrefs()}
            >
              Start Writing
            </button>
          </Link>
        </div>
      )}
      {/* Card Component */}
      <div className="mx-auto max-w-6xl p-5">
        <div className="w-full py-5 px-5 border-b mb-5 border-white/[0.6] flex justify-between flex-wrap gap-y-3 items-center">
          <div className="flex items-center gap-x-4">
            <h1 className="text-3xl text-white">User Posts</h1>
            <div className="flex flex-wrap gap-2 max-[408px]:hidden">
              <Button
                className={`inline-flex items-center justify-center rounded-full border border-slate-800 ${seePost ? 'bg-blue-600' : 'bg-gray-900'}  text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50`}
                onClick={handelSeePost}
              >
                Posts
              </Button>
              <Button
                className={`inline-flex rounded-full items-center justify-center border border-slate-800 ${seeStories ? 'bg-green-600' : 'bg-gray-900'} bg-gray-900 text-white transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-50`}
                onClick={handelSeeStories}
              >
                Stories
              </Button>
            </div>
          </div>
          {selectedPosts.length > 0 && seePost && (
            <Button
              bgColor="bg-red-500"
              className="inline-flex animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              type="submit"
              onClick={deleteSelectedPosts}
            >
              {selectedPosts.length > 1 ? `Delete posts` : `Delete post`}
            </Button>
          )}
          {selectedStories.length > 0 && seeStories && (
            <Button
              bgColor="bg-red-500"
              className="inline-flex animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              type="submit"
              onClick={deleteSelectedPosts}
            >
              {selectedStories.length > 1 ? `Delete stories` : `Delete story`}
            </Button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          <div className="flex flex-wrap gap-2 min-[409px]:hidden justify-end w-full">
            <Button
              className={`inline-flex items-center justify-center rounded-full border border-slate-800 ${seePost ? 'bg-blue-600' : 'bg-gray-900'} text-white transition focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:bg-blue-600`}
            >
              Posts
            </Button>
            <Button
              className={`inline-flex rounded-full items-center justify-center border border-slate-800 ${seeStories ? 'bg-green-600' : 'bg-gray-900'} text-white hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-slate-50`}
            >
              Stories
            </Button>
          </div>
          {posts.length == 0 && (
            <div className="mt-5 text-white text-xl">No post</div>
          )}
          {seePost &&
            !seeStories &&
            posts.map((item) => (
              <div
                className="max-w-sm w-full bg-white rounded-lg shadow-md overflow-hidden mt-10 gap-x-10 relative cursor-pointer"
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
                  checked={selectedPosts.some(
                    (post) =>
                      post.postId == item.$id && post.imageId == item.image
                  )}
                  onChange={() =>
                    toggleSelectPost({ postId: item.$id, imageId: item.image })
                  }
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

          {seeStories &&
            !seePost &&
            stories.map((item) => (
              <div
                className="max-w-sm w-full bg-white rounded-lg shadow-md overflow-hidden mt-10 gap-x-10 relative cursor-pointer"
                key={item.$id}
                onClick={() => navigate(`/editStory/${item.$id}`)}
              >
                <img
                  src={service.getFilePreviews(item.image)}
                  alt="Cow Image"
                  className="w-full h-48 object-cover"
                />
                <Input
                  type="checkbox"
                  checked={selectedStories.some(
                    (story) =>
                      story.storyId == item.$id && story.imageId == item.image
                  )}
                  onChange={() =>
                    toggleSelectStory({
                      storyId: item.$id,
                      imageId: item.image,
                    })
                  }
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
