import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '../components/Button'
import { rawData } from '../store/authSlice'
import authService from '../appwrite/auth'

// SEO meta function for Remix
export const meta = () => {
  return [
    { title: 'Email Verification - rogBlog' },

    {
      name: 'description',
      content:
        "Verify your email address to access your account. Didn't receive the email? Resend the verification link easily.",
    },

    {
      name: 'keywords',
      content:
        'email verification, verify email, resend verification link, secure login, account verification',
    },

    { property: 'og:title', content: 'Email Verification - rogBlog' },

    {
      property: 'og:description',
      content:
        'Complete your account setup by verifying your email address. Click the link in your inbox or resend it if needed.',
    },

    { property: 'og:type', content: 'website' },

    // { property: "og:url", content: "https://yourdomain.com/email-verification" },

    // { property: "og:image", content: "https://yourdomain.com/images/verification-thumbnail.jpg" },

    { name: 'twitter:card', content: 'summary_large_image' },

    { name: 'twitter:title', content: 'Email Verification - rogBlog' },

    {
      name: 'twitter:description',
      content:
        "Verify your email to complete the registration process. Didn't get the email? Resend the link now.",
    },

    { name: 'robots', content: 'index,follow' },
  ]
}

export default function EmailVerification() {
  const userData = useSelector((state) => state.auth.rawDatas)
  const dispatch = useDispatch()
  const [isTimerActive, setIsTimerActive] = useState(true)
  const [timer, setTimer] = useState(30)
  const [error, setError] = useState('')

  useEffect(() => {
    // fetching current user
    const currentUser = async () => {
      const userData = await authService.getCurrentUser()
      if (userData) {
        dispatch(rawData(userData))
      }
    }
    currentUser()
    if (isTimerActive && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)

      return () => clearInterval(countdown)
    } else if (timer === 0) {
      setIsTimerActive(false)
    }
  }, [isTimerActive, timer])

  const resendLink = async () => {
    const verification = await authService
      .verifyEmailLogin()
      .then(() => {})
      .catch((err) => {
        console.log(err.message)
        setError(err.message)
      })
  }
  const handleResendClick = () => {
    setTimer(30)
    setIsTimerActive(true)
    resendLink()
  }

  if (userData == null) {
    return (
      <div className="text-white mt-52 text-3xl text-center">
        <p>you are not authorize to access this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-gray-900 text-gray-100 rounded-lg shadow-lg border border-gray-700">
      {error.length != 0 ? (
        <div className="py-5">
          <p className="text-red-600">{error}</p>
        </div>
      ) : null}
      <h2 className="text-2xl font-bold text-gray-50 text-center">
        Verify Your Email
      </h2>
      <p className="mt-4 text-gray-400 text-center">
        A verification link has been sent to your email address:
      </p>
      <p className="mt-2 text-blue-400 text-center font-medium">
        {userData ? `${userData.email}` : 'error in fetching email'}
      </p>
      <p className="mt-4 text-gray-400 text-center">
        Please check your inbox and click the link to verify your account. If
        you didn’t receive the email, you can resend the link after the timer
        ends.
      </p>
      <div className="mt-6 flex justify-center">
        {isTimerActive ? (
          <div className="text-gray-400 text-sm">
            Resend Link available in {timer} seconds
          </div>
        ) : (
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleResendClick}
          >
            Resend Verification Link
          </Button>
        )}
      </div>
    </div>
  )
}
