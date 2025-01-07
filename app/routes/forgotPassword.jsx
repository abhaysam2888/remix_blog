import React, { useState } from 'react'
import authService from '../appwrite/auth'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import Button from '../components/Button'
import { Link } from '@remix-run/react'

export const meta = () => {
  return [
    { title: 'Recover Password - rogBlog' },
    {
      name: 'description',
      content:
        'Recover your rogBlog account password securely. Follow the instructions sent to your email to reset your password.',
    },
    {
      name: 'keywords',
      content:
        'rogBlog password recovery, reset password, account recovery, recover rogBlog account',
    },
    {
      property: 'og:title',
      content: 'Recover Password - rogBlog',
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
      content: 'Recover Password - rogBlog',
    },
    {
      name: 'twitter:description',
      content: 'Easily recover your rogBlog password and get back to blogging!',
    },
    { name: 'robots', content: 'index,follow' },
  ]
}

export default function RecoverPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await authService.recoverPassword({ email })
      setMessage('Recovery email sent! Please check your inbox.')
      setEmail('')
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setEmail('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-screen text-white">
      <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          Recover Your Password
        </h1>
        {message && (
          <p className="text-green-500 mb-4 text-center">{message}</p>
        )}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-black rounded-md"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-2 px-4 rounded-md"
          >
            {loading ? 'Sending...' : 'Send Recovery Email'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-4">
          Remembered your password?{' '}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Log in here
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
