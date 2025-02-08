import { Link, useNavigate, useParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import service from '../appwrite/config'
import Button from '../components/Button'
import TracingBeam from '../components/ui/tracing-beam'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'

export default function Post() {
  const { postid } = useParams()
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userCred)

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!postid) return

    const fetchArticle = async () => {
      try {
        const fetchedArticle = await service.getPost(postid)
        if (!fetchedArticle) throw new Error('Article not found')
        setArticle(fetchedArticle)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [postid])

  const delPost = async () => {
    if (!article) return
    await service.deletePost(article.$id).then((status) => {
      if (status) {
        service.deleteFile(article.image)
        navigate('/')
      }
    })
  }

  if (loading) return <div className="text-center mt-10">Loading...</div>
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>

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
            <div className="bg-black text-white rounded-full text-lg px-4 py-1 mb-2 sm:mb-0">
              Author: {article.username.charAt(0).toUpperCase() + article.username.slice(1)}
            </div>

            {isAuthor && (
              <div className="flex gap-2 sm:gap-4 flex-wrap">
                <Link to={`/editPost/${article.$id}`}>
                  <Button bgColor="bg-green-500">Edit</Button>
                </Link>
                <Button bgColor="bg-red-500" onClick={delPost}>
                  Delete
                </Button>
              </div>
            )}
          </div>

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
