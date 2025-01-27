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

export const meta = () => {
  return [
    {
      title: `rogBlog - Discover Expert Blogging Articles and Resources`,
    },
    {
      name: 'keywords',
      content:
        'rogBlog, rogblog, blogging, coding challenges, personal experience, WordPress, content creation, SEO, blogging challenges, platform selection, writing style, technical difficulties, online content, digital publishing',
    },
    {
      name: 'description',
      content: `Explore engaging and insightful blog posts on rogBlog. Stay informed with expert tips, trends, and resources for successful blogging and content creation.`,
    },
    {
      name: 'og:title',
      content: `rogBlog - Discover Expert Blogging Articles and Resources`,
    },
    {
      name: 'og:description',
      content: `Dive into of the best blogging articles on rogBlog. Get expert advice on content creation, blogging tips, and the latest trends in digital marketing and technology.`,
    },
    {
      name: 'og:url',
      content: 'https://www.rogblog.me',
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'og:site_name',
      content: 'rogBlog',
    },
    {
      name: 'og:image:alt',
      content:
        'Featured blog posts and expert advice on blogging and digital marketing from rogBlog.',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: `rogBlog - Discover Expert Blogging Articles and Resources`,
    },
    {
      name: 'twitter:description',
      content: `Read of the most insightful blog posts on rogBlog, covering everything from content creation tips to the latest trends in blogging and digital marketing.`,
    },
    {
      name: 'robots',
      content: 'index,follow',
    },
  ]
}

export const links = () => {
  return [{ rel: 'canonical', href: 'https://www.rogblog.me' }]
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

  // for seo purpose
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: 'https://www.rogblog.me',
    name: 'rogBlog',
    description:
      'Browse our latest blog posts and stay updated with new content.',
    publisher: {
      '@type': 'Organization',
      name: 'rogBlog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.rogblog.me/favicon.ico',
      },
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.rogblog.me/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    mainEntity: [
      {
        '@type': 'WebPageElement',
        name: 'Explore Blogs',
        url: 'https://www.rogblog.me',
      },
      {
        '@type': 'WebPageElement',
        name: 'Add post',
        url: 'https://www.rogblog.me/addpost',
      },
      {
        '@type': 'WebPageElement',
        name: 'Login',
        url: 'https://www.rogblog.me/login',
      },
      {
        '@type': 'WebPageElement',
        name: 'User Profile',
        url: 'https://www.rogblog.me/UserProfile',
      },
      {
        '@type': 'WebPageElement',
        name: 'User Profile',
        url: 'https://www.rogblog.me/UserProfile',
      },
    ],
  }

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
      {/* Inline JSON-LD for Schema.org structured data */}
      {/* seo purpose */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </>
  )
}
