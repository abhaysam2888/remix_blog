import { useState } from 'react'
import { useNavigate } from '@remix-run/react'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import service from '../appwrite/config'
import { ID } from 'appwrite'
import { useSelector } from 'react-redux'
import Select from '../components/Select'

export const meta = () => {
  const title = 'Add a New Story'
  const description = `Create Stories with a detailed form`

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    {
      name: 'og:description',
      content: 'Create Stories with a detailed form',
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'robots', content: 'index,follow' },
  ]
}

export default function CreateStory({ story }) {
  const [title, setTitle] = useState((story && story.title) || '')
  const [image, setImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('active' || (story && story.status))
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const userData = useSelector((state) => state.auth.userCred)
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required.'
      setLoading(false)
    }
    if (!image && !story) {
      newErrors.image = 'Image is required.'
      setLoading(false)
    }
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setLoading(false)
      return
    }

    // Assuming you have an API route to handle the post creation
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('image', image)

      if (story) {
        if (userData) {
          let fileId = null
          if (image) {
            const uploadImage = await service.uploadFile(image)
            fileId = uploadImage.$id
            if (uploadImage) {
              const deleteExistingFile = await service.deleteFile(story?.image)
            }
          } else {
            fileId = story?.image
          }

          if (fileId != null) {
            const response = await service.updateStory(story.$id, {
              title,
              image: fileId,
              status,
            })

            if (response) {
              setUpdateSuccess(true)
              setTimeout(() => {
                navigate(`/story/${response.$id}`)
              }, 500)
            } else {
              setUpdateSuccess(false)
              setErrors({ submit: 'Failed to create post. Please try again.' })
            }
          }
          setLoading(false)
        }
      } else {
        if (userData) {
          const uploadImage = await service.uploadFile(image)
          const fileId = uploadImage.$id

          if (uploadImage) {
            const response = await service.createStory({
              title,
              image: fileId,
              slug: ID.unique(),
              userid: userData.$id,
              email: userData.email,
              username: userData.name,
              status,
            })

            if (response) {
              setSuccess(true)
              setTimeout(() => {
                navigate(`/story/${response.$id}`)
              }, 500)
            } else {
              setSuccess(false)
              setErrors({ submit: 'Failed to create post. Please try again.' })
            }
          }
          setLoading(false)
        }
      }
    } catch (error) {
      setErrors({ submit: 'An unexpected error occurred. Please try again.' })
    }
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

  if (success) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-green-400 text-center">
          congratulations you have created a new story successfully 🎉🎉🎉🎉🎉🎉
        </h2>
        <p className="mt-4 text-gray-300 text-center">
          Now you can add post on that story
        </p>
      </div>
    )
  }

  if (updateSuccess) {
    return (
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-green-400 text-center">
          congratulations you have update a existing story successfully
          🎉🎉🎉🎉🎉🎉
        </h2>
        <p className="mt-4 text-gray-300 text-center">
          Now you can add further post on that story
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[500px] my-0 mx-auto p-[20px]">
      <h2>Create a New Post</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div style={{ marginBottom: '15px' }}>
          <Label htmlFor="title">Title:</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title && (
            <p className="text-red-500 font-[14px]">{errors.title}</p>
          )}
        </div>

        {/* Image Input */}
        <div style={{ marginBottom: '15px' }}>
          <Label htmlFor="image">Upload Image:</Label>
          <Input
            label="Featured Image :"
            type="file"
            className="h-[50px] mb-1 block w-full text-sm text-slate-500 file:mr-4 file:px-4 file:cursor-pointer file:py-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            onChange={(e) => setImage(e.target.files[0])}
          />
          {errors.image && (
            <p style={{ color: 'red', fontSize: '14px' }}>{errors.image}</p>
          )}
        </div>

        {story && (
          <div className="w-full mb-4">
            <img
              src={service.getFilePreviews(story.image)}
              alt={story.title}
              className="rounded-lg"
            />
          </div>
        )}

        {/* status */}
        <Label htmlFor="image">Status:</Label>
        <Select
          options={['active', 'inactive']}
          className="mb-4 bg-[#27272a] text-white h-[45px]"
          onChange={(e) => setStatus(e.target.value)}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="py-[10px] px-[20px] bg-[#4CAF50] cursor-pointer text-white border-none rounded-[5px]"
          disabled={loading}
        >
          Submit
        </button>

        {/* Submission Error */}
        {errors.submit && (
          <p className="text-red-500 mt-[15px]">{errors.submit}</p>
        )}
      </form>
    </div>
  )
}
