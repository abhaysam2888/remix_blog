import { useNavigate, useSearchParams } from '@remix-run/react'
import React, { useEffect, useState } from 'react'
import authService from '../appwrite/auth'

export const meta = () => {
  return [
    { title: 'Email Verification Successful - rogBlog' },
    {
      name: 'description',
      content:
        'Congratulations! Your email has been successfully verified. You can now access all features of your account on rogBlog.',
    },
    {
      name: 'keywords',
      content:
        'email verification success, verified email, account activation, secure login, rogBlog',
    },
    {
      property: 'og:title',
      content: 'Email Verification Successful - rogBlog',
    },
    {
      property: 'og:description',
      content:
        'Your email verification is complete! Start exploring and enjoying all the features rogBlog has to offer.',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: 'Email Verification Successful - rogBlog',
    },
    {
      name: 'twitter:description',
      content:
        'Great news! Your email has been verified. Access your account and enjoy all rogBlog features.',
    },
    { name: 'robots', content: 'index,follow' },
  ]
}

export default function SucessfullEmailVerification() {
  const [isVerified, setIsVerified] = useState(false)
  const [verificationError, setVerificationError] = useState(null)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Handle verification when URL parameters are present
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')

    if (userId && secret) {
      // Replace this with your actual verification API call
      const link = async () => {
        const verification = await authService
          .SuccessfullverifyEmailLogin({ userId, secret })
          .then((res) => {
            setIsVerified(true)
            setVerificationError(null)

            // Navigate to remove sensitive query params
            setTimeout(() => navigate('/'), 1000)
          })
          .catch((error) => {
            setIsVerified(false)
            setVerificationError(error.message || 'Verification failed.')
            console.log(error)
          })
      }
      link()
    }
  }, [searchParams, navigate])

  return (
    <>
      {isVerified ? (
        <div className="mt-10">
          {verificationError && verificationError}
          <h2 className="text-2xl font-bold text-green-400 text-center">
            Verification Successful!
          </h2>
          <p className="mt-4 text-gray-300 text-center">
            Your email has been verified. You can now use all features of your
            account.
          </p>
        </div>
      ) : (
        <p className="text-white text-center text-3xl mt-[15%]"> loading...</p>
      )}
    </>
  )
}
