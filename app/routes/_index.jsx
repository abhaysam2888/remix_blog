import { Query } from 'appwrite'
import service from '../appwrite/config'
import {
  useLoaderData,
  json,
  useSearchParams,
  useNavigate,
} from '@remix-run/react'
import AllPost from '../components/AllPost'
import { useEffect } from 'react'
import authService from '../appwrite/auth'
import { useDispatch } from 'react-redux'
import { login, logout } from '../store/authSlice'
import Footer from '../components/Footer'
import GetCurrentUser from '../components/GetCurrentUser'

export const meta = ({ data }) => {
  const postCount = data?.totalPosts || 0

  return [
    { title: `Featured Posts - ${postCount} Articles Available` },
    {
      name: 'description',
      content: `Check out our ${postCount} latest posts and articles.`,
    },
    {
      name: 'og:title',
      content: `Featured Posts - ${postCount} Articles Available`,
    },
    {
      name: 'og:description',
      content:
        'Browse our latest blog posts and stay updated with new content.',
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'robots', content: 'index,follow' },
    { name: 'canonical' ,content:"https://www.rogblog.me"},
    {name: "og:url", content:"https://www.rogblog.me"},
    {name: "og:type", content: "website"},
  ]
}

// Fetch posts with the loader
export let loader = async ({ request }) => {
  const url = new URL(request.url)

  // Parse offset and limit from the URL
  const offset = parseInt(url.searchParams.get('offset') || '0', 10) // Default to 0
  const postsPerPage = 5 // Number of posts per page

  // Fetch the posts
  try {
    const posts = await service.getPosts(
      Query.limit(postsPerPage),
      Query.offset(offset)
    )

    const totalPosts = posts.total
    const postsWithImages = await Promise.all(
      posts.documents.map(async (post) => {
        const filePreviewUrl = service.getFilePreviews(post.image)
        return {
          ...post,
          username: post.username || 'Unknown User',
          title: post.title || 'Untitled Post',
          content: post.content || 'No content available.',
          imageUrl: filePreviewUrl,
        }
      })
    )

    return json({
      posts: postsWithImages,
      totalPosts,
      offset,
      postsPerPage,
    })
  } catch (error) {
    console.log(error.message)
    return json({
      error: error.message,
    })
  }
}

export default function Index() {
  const { posts, totalPosts, offset, postsPerPage } = useLoaderData()

  const dispatch = useDispatch()

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const secret = searchParams.get('secret')
  const userId = searchParams.get('userId')

  useEffect(() => {
    const getUser = async () => {
      try {
        if (userId && secret) {
          const verifyGoogleLogin = await authService.verifyGoogleLogin({
            userId,
            secret,
          })

          if (verifyGoogleLogin !== undefined) {
            const currentUser = await authService.getCurrentUser()

            if (currentUser.emailVerification !== false) {
              dispatch(login(currentUser))
              navigate('/')
            }
          }
        }
      } catch (error) {
        console.error('Error in getUser:', error)
        dispatch(logout())
      }
    }

    getUser()
  }, [userId, secret])

  return (
    <>
      <AllPost
        offset={offset}
        posts={posts}
        postsPerPage={postsPerPage}
        totalPosts={totalPosts}
      />
      <Footer />
      <GetCurrentUser />
    </>
  )
}
