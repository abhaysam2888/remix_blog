import React, { useCallback, useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Button from '../components/Button'
import Input from '../components/Input'
import RTE from '../components/RTE'
import Select from '../components/Select'
import { useDispatch, useSelector } from 'react-redux'
import { getSlug } from '../store/getPostSlice'
import axios from 'axios'
import conf from '../conf/conf'
import { useNavigate } from '@remix-run/react'
import service from '../appwrite/config'
import { ID } from 'appwrite'

export const meta = () => {
  const title = 'Add a New Post'
  const description = `Create posts with a detailed form, AI-generated content suggestions, and advanced features.",
  "og:title": "Add a New Post`

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    {
      name: 'og:description',
      content:
        'Create posts with a detailed form, AI-generated content suggestions, and advanced features.',
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'robots', content: 'index,follow' },
  ]
}

export default function AddPost({ post }) {
  const userData = useSelector((state) => state.auth.userCred)
  const { register, handleSubmit, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || '',
      slug: post?.$id || '',
      content: post?.content || '',
      status: post?.status || 'active',
    },
  })

  const navigate = useNavigate()
  const userAuth = useSelector((state) => state.auth.status)
  const [disabel, setDisabel] = useState(false)
  const dispatch = useDispatch()
  const [input, setInput] = useState('')
  const [responses, setResponse] = useState('')
  const [cache, setCache] = useState({})
  const [loading, setloading] = useState(false)
  const [loaderState, setLoaderState] = useState(false)

  const textRef = useRef(null)

  const copyClick = useCallback(() => {
    textRef.current.select()
    window.navigator.clipboard.writeText(responses)
  }, [responses])

  async function generateArticle() {
    setloading(true)
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${conf.chatGptApiKey}`,
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Please generate a well-structured article titled "${input}". The article should be formatted using only the necessary HTML tags (such as <h1>, <h2>, <p>, etc.). The article must not include any HTML boilerplate, head, body, or other unnecessary tags. The structure should include:

- A single <h1> tag for the main title (this should be used only once in the article, at the beginning).
- Multiple <h2> tags for section titles (these should follow the main title and divide the content into logical sections).
- Use <p> tags for paragraphs of text.
- Each section should have a heading with a <h2> tag.
- The article should include an introduction, several main sections, and a conclusion.
- Avoid placing <h1> tags inside <p> or using any other heading tags inside paragraphs.
- Ensure all content is informative, clear, and engaging while maintaining a formal tone.
- Avoid extraneous elements like inline styles or JavaScript.
- The article should be fully contained within these tags, using only valid and minimal HTML elements.

The generated HTML should not include any unnecessary or mismatched tags that would cause rendering or hydration errors. Ensure a valid structure with a single <h1> and <h2> tags used appropriately.
`,
                },
              ],
            },
          ],
        },
      })

      setloading(false)
      const generatedText = response.data.candidates[0].content.parts[0].text
      setCache((prevCache) => ({ ...prevCache, [input]: generatedText }))
      setResponse(generatedText)
    } catch (error) {
      console.error('Error generating article:', error)
      setloading(false)
    }
  }

  const handleClick = () => {
    if (cache[input]) {
      setResponse(cache[input])
    } else {
      if (input.length !== 0) {
        generateArticle()
      } else {
        setResponse('No title')
      }
    }
  }

  useEffect(() => {
    if (post && input.length === 0) {
      setTimeout(() => {
        setInput(post.title)
        setValue('title', post.title)
      }, 100)
    }
  }, [post, input])

  const handleInputChange = (event) => {
    const value = event.target.value
    setValue('title', value)
    setInput(value)
  }

  const submit = async (data) => {
    setDisabel(true)
    setLoaderState(true)
    // Call action function to handle post submission (update post)
    try {
      if (post) {
        const file = data.image[0]
          ? await service.uploadFile(data.image[0])
          : null
        if (file) {
          service.deleteFile(post.image)
        }
        const dbPost = await service.updatePost(post.$id, {
          ...data,
          image: file ? file.$id : undefined,
        })

        if (dbPost) {
          dispatch(getSlug(dbPost.$id))
          navigate(`/post/${dbPost.$id}`)
        }
        // Call action function to handle post submission (create post)
      } else {
        const file = await service.uploadFile(data.image[0])
        if (file) {
          const fileId = file.$id
          data.image = fileId
          data.slug = ID.unique()
          const dbPost = await service.createPost({
            ...data,
            userid: userData.$id,
            email: userData.email,
            username: userData.name,
          })

          if (dbPost && !dbPost.error) {
            dispatch(getSlug(dbPost.$id))
            navigate(`/post/${dbPost.$id}`)
          }
        }
      }
    } catch (error) {
      console.log(error)
      setDisabel(false)
      setLoaderState(false)
    }
  }

  if (userData && post) {
    if (userData?.$id !== post?.userid) {
      return (
        <div className="text-white mt-52 text-3xl text-center">
          <p>you are not authorize to edit this content</p>
          <p className="mt-2 text-red-600">
            your account may be banned for this action
          </p>
        </div>
      )
    }
  }

  if (!userAuth) {
    return (
      <div className="text-white mt-52 text-3xl text-center">
        <p>Login to Access this tab</p>
      </div>
    )
  }

  // loader indicator
  if (loaderState) {
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
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap mt-8">
      <div className="w-2/3 px-2 max-md:w-full">
        <label className="inline-block mb-1 pl-1" htmlFor={'ai-gen2'}>
          Title :
        </label>
        <input
          placeholder="title"
          className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full mb-4"
          id="ai-gen2"
          {...register('title', { required: true })}
          onChange={handleInputChange}
        />
        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues('content')}
        />
      </div>
      <div className="w-1/3 px-2 max-md:w-full max-md:mt-5">
        <Input
          label="Featured Image :"
          type="file"
          className="h-[50px] mb-1 block w-full text-sm text-slate-500 file:mr-4 file:px-4 file:cursor-pointer file:py-2 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register('image', { required: !post })}
        />
        {post && (
          <div className="w-full mb-4">
            <img
              src={service.getFilePreviews(post.image)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}
        <Select
          options={['active', 'inactive']}
          label="Status"
          className="mb-4"
          {...register('status', { required: true })}
        />
        <label className="inline-block mb-1 pl-1" htmlFor={'ai-gen'}>
          AI Suggestion :
        </label>
        <div
          className={`px-3 py-2 rounded-lg bg-white text-black focus:bg-gray-50 duration-200 border border-gray-200 w-full ${responses.length > 8 ? 'h-[500px]' : 'min-h-5'} mb-4`}
        >
          <div>
            <div className="flex justify-between">
              <span className="text-red-600">suggestion:</span>
              <div
                className="bg-gray-700 text-white py-1 px-2 rounded-lg text-sm font-mono cursor-pointer"
                onClick={copyClick}
              >
                Copy
              </div>
            </div>
            <br />
            {loading ? (
              <p className="text-center mt-5">Loading....</p>
            ) : (
              <textarea
                className={`w-full ${responses.length > 8 && 'h-96'} outline-none web`}
                ref={textRef}
                value={responses}
                readOnly
              />
            )}
          </div>
        </div>
        <div className="my-3">
          <p>
            {responses.length > 8
              ? 'copy the above text >> (Editor) view >> source code >> paste it >> save it'
              : ''}
          </p>
        </div>
        <div
          className={`w-full rounded-lg px-4 py-2 text-center cursor-pointer ${post ? 'bg-green-500' : 'bg-blue-600'}`}
          onClick={handleClick}
        >
          Generate
        </div>
        <Button
          type="submit"
          bgColor={post ? 'bg-green-500' : undefined}
          className={`w-full mt-5 ${disabel ? 'bg-red-500' : 'bg-blue-500'}`}
          disabled={disabel}
        >
          {post ? 'Update' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}