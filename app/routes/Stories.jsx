import React from 'react'
import service from '../appwrite/config'
import { json, Link, useLoaderData, useNavigate } from '@remix-run/react'
import { Query } from 'appwrite'
import Button from '../components/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { faAngleRight, faUser } from '@fortawesome/free-solid-svg-icons'

export let loader = async ({ request }) => {
  const url = new URL(request.url)

  // Parse offset and limit from the URL
  const offset = parseInt(url.searchParams.get('offset') || '0', 10) // Default to 0
  const postsPerPage = 6 // Number of posts per page

  // Fetch the posts
  try {
    const stories = await service.getStories(
      Query.limit(postsPerPage),
      Query.offset(offset)
    )

    const totalStories = stories.total
    const postsWithImages = await Promise.all(
      stories.documents.map(async (post) => {
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
      stories: postsWithImages,
      totalStories,
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

export const meta = () => {
  const capitalizedTitle = 'Discover Expert Blogging Stories and Resources'
  const storyUrl = `https://www.rogblog.me/stories/`

  return [
    { title: `${capitalizedTitle} - rogBlog` },
    { name: 'description', content: `Read "${capitalizedTitle}" on rogBlog.` },
    { name: 'og:title', content: `${capitalizedTitle} - rogBlog` },
    {
      name: 'og:description',
      content: `Read "${capitalizedTitle}" on rogBlog.`,
    },
    { name: 'og:url', content: storyUrl },
    { name: 'og:type', content: 'article' },
    { name: 'og:site_name', content: 'rogBlog' },
    { name: 'og:image:alt', content: `Image for ${capitalizedTitle}` },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: `${capitalizedTitle} - rogBlog` },
    {
      name: 'twitter:description',
      content: `Read "${capitalizedTitle}" on rogBlog.`,
    },
    { name: 'robots', content: 'index,follow' },
  ]
}

export const links = () => {
  return [{ rel: 'canonical', href: 'https://www.rogblog.me/Stories' }]
}

export default function Stories() {
  const { offset, postsPerPage, totalStories, stories } = useLoaderData()
  const userData = useSelector((state) => state.auth.userCred)
  const navigate = useNavigate()

  // Calculate total pages and current page
  const totalPages = Math.ceil(totalStories / postsPerPage)
  const currentPage = Math.floor(offset / postsPerPage) + 1

  // Calculate next and previous offsets
  const nextOffset = offset + postsPerPage
  const prevOffset = offset - postsPerPage

  // Handle page navigation
  const handlePageChange = (newOffset) => {
    navigate(`?offset=${newOffset}`)
  }

  return (
    <>
      {/* heading */}
      <div className="mx-auto max-w-6xl p-5">
        <div className="w-full py-5 px-5 border-b mb-5 border-white/[0.6] flex justify-between items-center">
          <h1 className="text-3xl text-white max-[340px]:text-2xl">
            Featured Stories
          </h1>
          {/* user profile route */}
          {userData !== null && (
            <FontAwesomeIcon
              icon={faUser}
              className="text-white size-8 cursor-pointer"
              onClick={() => navigate('/UserProfile')}
            />
          )}
        </div>
      </div>
      <div className="w-full h-full">
        <div className="mx-auto max-w-7xl">
          {/* Posts */}
          <div className="flex flex-wrap justify-center items-center gap-y-10 gap-x-10">
            {stories &&
              stories.map((item) => (
                <div key={item.$id}>
                  <div className=" border border-[#2f3e53] w-[360px]">
                    {/* Image */}
                    <div className="w-[360px] h-[220px] max-[380px]:w-[290px]">
                      <img
                        srcSet={`${service.getFilePreviews(item.image, 360, 220, '90')} 290w, ${service.getFilePreviews(item.image, 0, 220, '90')} 360w`}
                        sizes="(max-width: 380px) 290px, 360px"
                        src={service.getFilePreviews(item.image, 0, 220, '90')}
                        alt={item.title}
                        className="w-full h-[220px] object-cover md:w-[360px] max-md:h-[220px]"
                        loading="lazy"
                      />
                    </div>
                    {/* Content */}
                    <div className="w-full md:max-w-2xl space-y-4 px-4 py-5">
                      {/* Author Info */}
                      <div className="flex items-center text-gray-300 space-x-4">
                        <p className="text-sm flex items-center">
                          <FontAwesomeIcon icon={faUser} className="w-3" />
                          <span className="ml-2">
                            {item.username || 'username'}
                          </span>
                        </p>
                        <p className="text-sm">
                          {`${new Date(item.$createdAt).getDate()}-${new Date(item.$createdAt).getMonth() + 1}-${new Date(item.$createdAt).getFullYear()}`}
                        </p>
                      </div>

                      {/* Title */}
                      <div>
                        <h2 className="text-xl font-semibold text-white line-clamp-3">
                          {item.title ||
                            'Title Lorem ipsum, dolor sit amet consectetur adipisicing elit.'}
                        </h2>
                      </div>

                      {/* Button */}
                      <div>
                        <Link prefetch="intent" to={`/story/${item.$id}`}>
                          <Button className="inline-flex space-x-3 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 rounded-lg">
                            <span>See Posts Inside</span>
                            <span>
                              <FontAwesomeIcon
                                icon={faAngleRight}
                                className="text-gray-700"
                              />
                            </span>
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center my-5">
          <div className="pagination flex space-x-2 items-center">
            {/* Previous Button */}
            {prevOffset >= 0 && (
              <Button
                className="rounded-lg"
                onClick={() => handlePageChange(prevOffset)}
              >
                Previous
              </Button>
            )}
            {/* Page Info */}
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            {/* Next Button */}
            {nextOffset < totalStories && (
              <Button
                className="rounded-lg"
                onClick={() => handlePageChange(nextOffset)}
              >
                Next
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
