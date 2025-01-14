import React from 'react'
import { Link, useNavigate } from '@remix-run/react'
import Button from './Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import parse from 'html-react-parser'
import { useSelector } from 'react-redux'
import authService from '../appwrite/auth'

export default function AllPost({ posts, totalPosts, offset, postsPerPage }) {
  const navigate = useNavigate()
  const userData = useSelector((state) => state.auth.userCred)
  const rawData = useSelector((state) => state.auth.rawDatas)

  // Calculate total pages and current page
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const currentPage = Math.floor(offset / postsPerPage) + 1

  // Calculate next and previous offsets
  const nextOffset = offset + postsPerPage
  const prevOffset = offset - postsPerPage

  // Handle page navigation
  const handlePageChange = (newOffset) => {
    navigate(`?offset=${newOffset}`)
  }

  const handelClick = async () => {
    const verification = await authService.verifyEmailLogin()
    navigate('/emailVerification')
  }

  return (
    <div className="mb-10">
      {userData == null && rawData !== undefined && rawData !== null ? (
        <div className="w-full justify-center flex pt-10 mb-5">
          <div className="text-center p-4 bg-black border border-red-400 rounded-md w-fit">
            <h2 className="text-lg font-bold text-red-700">
              Email Verification Failed.
            </h2>
            <p className="text-white mt-2">
              Your email is not verified{' '}
              <u className="text-red-600 cursor-pointer" onClick={handelClick}>
                Click here
              </u>{' '}
              to verify.
            </p>
          </div>
        </div>
      ) : null}

      <div className="w-full h-full">
        <div className="mx-auto max-w-6xl p-5">
          {/* Post Type */}
          <div className="w-full py-5 px-5 border-b mb-5 border-white/[0.6] flex justify-between items-center">
            <h1 className="text-3xl text-white">Featured Post</h1>
            {/* user profile route */}
            {userData !== null && (
              <FontAwesomeIcon
                icon={faUser}
                className="text-white size-8 cursor-pointer"
                onClick={() => navigate('/UserProfile')}
              />
            )}
          </div>

          {/* Posts */}
          <div className="space-y-6">
            {posts &&
              posts.map((item) => (
                <div key={item.$id}>
                    <div className="flex flex-col md:flex-row justify-between items-center max-md:border max-md:border-[#2f3e53]">
                      {/* Image */}
                      <div className="w-full md:w-[390px] md:h-[220px] flex justify-center">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-[220px] object-cover md:w-[390px] max-md:h-[320px]"
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
                          <h2 className="text-xl font-semibold text-white truncate">
                            {item.title ||
                              'Title Lorem ipsum, dolor sit amet consectetur adipisicing elit.'}
                          </h2>
                        </div>

                        {/* Content */}
                        <div>
                        {/* for seo that ensure not more h1 tags */}
                          <span className="text-white line-clamp-3">
                            {parse(item.content.replace(/<h1>/g, '<h2>').replace(/<\/h1>/g, '</h2>')) ||
                              'Some text Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, repellendus.'}
                          </span>
                        </div>

                        {/* Read More Button */}
                        <div>
                        <Link to={`/post/${item.$id}`} key={item.title}>
                          <Button className="inline-flex space-x-3 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000,45%,#0000,55%,#000)] bg-[length:200%_100%] px-6 text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                            <span>Read more</span>
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
              <Button onClick={() => handlePageChange(prevOffset)}>
                Previous
              </Button>
            )}
            {/* Page Info */}
            <span className="text-white">
              Page {currentPage} of {totalPages}
            </span>
            {/* Next Button */}
            {nextOffset < totalPosts && (
              <Button onClick={() => handlePageChange(nextOffset)}>Next</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
