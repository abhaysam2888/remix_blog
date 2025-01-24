// app/routes/reset.jsx
import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import Button from '../components/Button'
import { Link } from '@remix-run/react'
import { useNavigate } from '@remix-run/react'

export const meta = () => {
  return [
    { title: 'Reset Password - rogBlog' },
    {
      name: 'description',
      content:
        'Reset your rogBlog account password securely. Set a new password to regain access to your account.',
    },
    {
      name: 'keywords',
      content:
        'rogBlog password reset, reset password, account recovery, set new password',
    },
    {
      property: 'og:title',
      content: 'Reset Password - rogBlog',
    },
    {
      property: 'og:description',
      content:
        'Securely reset your rogBlog password and regain access to your account.',
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
      content: 'Reset Password - rogBlog',
    },
    {
      name: 'twitter:description',
      content: 'Easily reset your rogBlog password and get back to blogging!',
    },
    { name: 'robots', content: 'index,follow' },
  ]
}

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    const searchParams = new URLSearchParams(window.location.search)
    const userId = searchParams.get('userId')
    const secret = searchParams.get('secret')

    if (!userId || !secret) {
      setError('Invalid or missing reset parameters.')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setLoading(false)
      return
    }

    try {
      const response = await authService.resetPasswordSuccessfully({
        userId,
        secret,
        password,
        confirmPassword,
      })
      setMessage(
        'Password reset successful! You can now log in with your new password.'
      )
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen text-white">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Reset Your Password
        </h1>
        {message && (
          <p className="text-green-500 mb-4 text-center">{message}</p>
        )}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-black rounded-md"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 text-black rounded-md"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-md"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Remembered your password?{' '}
          <Link prefetch='render' href="/login" className="text-indigo-400 hover:underline">
            Log in here
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
