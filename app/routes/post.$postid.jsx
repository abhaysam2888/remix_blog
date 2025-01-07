import { json } from '@remix-run/node'
import { Link, useLoaderData, useNavigate } from '@remix-run/react'
import service from '../appwrite/config'
import Button from '../components/Button'
import TracingBeam from '../components/ui/tracing-beam'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'

export const meta = ({ data }) => {
  const { article } = data

  return [
    { title: `${article.title}` },
    {
      name: 'description',
      content: `Explore the insights and perspectives shared by ${article.username}. Stay informed and updated.`,
    },
    {
      name: 'og:title',
      content: article.title,
    },
    {
      name: 'og:description',
      content:
        "Discover detailed insights about React's ecosystem and its role in modern web development.",
    },
    {
      name: 'og:image',
      content: service.getFilePreviews(article.image),
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: article.title,
    },
    {
      name: 'twitter:description',
      content:
        "Check out this engaging article about React's unique position as a library and framework.",
    },
    {
      name: 'twitter:image',
      content: service.getFilePreviews(article.image),
    },
    { name: 'robots', content: 'index,follow' },
    {canonical: `https://www.rogblog.me/post/${article.$id}`}
  ]
}

// Loader function to fetch post data
export async function loader({ params }) {
  const { postid } = params

  if (!postid) {
    throw new Response('Id not found', { status: 404 })
  }
  const article = await service.getPost(postid)

  if (!article) {
    throw new Response('article not found', { status: 404 })
  }

  return json({ article })
}

// Action function for deleting a post
export default function Post() {
  const { article } = useLoaderData()
  console.log(article)

  const userData = useSelector((state) => state.auth.userCred)
  console.log(userData)
  const navigate = useNavigate()

  const delPost = async () => {
    await service.deletePost(article.$id).then((status) => {
      if (status) {
        service.deleteFile(article.image)
        navigate('/')
      }
    })
  }

  const isAuthor = article && userData ? article.userid === userData.$id : false

  return (
    <TracingBeam className="px-6 mt-8">
      <style>
        {`
        .scrollBar::-webkit-scrollbar {
          display: none;
        }
        `}
      </style>
      <div className="max-w-2xl mx-auto antialiased pt-4 relative">
        <div className="mb-10">
          <div className="flex flex-wrap justify-between items-center p-4">
            {/* Author Section */}
            <div className="bg-black text-white rounded-full text-lg px-4 py-1 mb-2 sm:mb-0">
              Author:{' '}
              {article.username.charAt(0).toUpperCase() +
                article.username.slice(1)}
            </div>

            {/* Buttons for Edit and Delete */}
            {isAuthor && (
              <div className="flex gap-2 sm:gap-4 flex-wrap">
                <Link to={`/editPost/${article.$id}`}>
                  <Button
                    bgColor="bg-green-500"
                    className="inline-flex animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    Edit
                  </Button>
                </Link>

                <Button
                  bgColor="bg-red-500"
                  className="inline-flex animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  onClick={() => delPost()}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>

          <h1 className="text-6xl w-full my-10 px-4 font-bold max-[714px]:text-5xl max-[588px]:text-4xl prose dark:prose-invert max-[461px]:text-3xl max-[461px]:my-5 max-[397px]:text-2xl">
            {article.title}
          </h1>

          <div>
            <img
              src={service.getFilePreviews(article.image)}
              alt={article.title}
              className="rounded-xl"
              loading="lazy"
            />
            <div className="mt-5 prose dark:prose-invert overflow-scroll scrollBar text-xl">
              {parse(article.content)}
            </div>
          </div>
        </div>
      </div>
    </TracingBeam>
  )
}
