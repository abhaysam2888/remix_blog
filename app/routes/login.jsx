import React, { useState } from 'react'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { cn } from '../lib/utils'
import Button from '../components/Button'
import { IconBrandGoogle } from '@tabler/icons-react'
import { Form, useNavigate } from '@remix-run/react'
import authService from '../appwrite/auth.js'
import { useDispatch } from 'react-redux'
import { login, rawData } from '../store/authSlice.js'

export const meta = () => {
  return [
    { title: 'Login to rogBlog - Access Your Account' },
    {
      name: 'description',
      content:
        'Securely log in to your rogBlog account to explore articles, create posts, and interact with the community. Your credentials are safe with us.',
    },
    {
      name: 'keywords',
      content:
        'rogBlog login, secure login, user account, access rogBlog, blogging platform, login page',
    },
    {
      property: 'og:title',
      content: 'Login to rogBlog - Access Your Account',
    },
    {
      property: 'og:description',
      content:
        'Welcome back! Log in to your rogBlog account to enjoy personalized features and stay connected with the community.',
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
      content: 'Login to rogBlog - Access Your Account',
    },
    {
      name: 'twitter:description',
      content:
        'Log in to rogBlog and enjoy a secure, personalized blogging experience. Join the conversation today!',
    },
    { name: 'robots', content: 'index,follow' },
  ]
}

export const links = () => {
  return [{ rel: 'canonical', href: 'https://www.rogblog.me/login' }]
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    setError('')
    const userLoginFun = async () => {
      try {
        const user = await authService.userLogin({ email, password })

        if (!user || user.error) {
          setError(user?.message || 'Login failed. Please try again.')
          return
        }

        const userData = await authService.getCurrentUser()
        if (userData) {
          dispatch(rawData(userData))
          if (userData.emailVerification === false) {
            setError('Please verify your email before logging in.')
            return
          }
          setSuccessMessage('Login successful!')
          dispatch(login(userData))
          navigate('/')
        } else {
          setError('Failed to fetch user data.')
          dispatch(rawData(null))
        }
      } catch (error) {
        setError(error.message || 'An error occurred during login.')
      }
    }
    userLoginFun()
  }

  const handleGoogleLogin = async () => {
    try {
      const googleLogin = await authService.createGoogleLogin()
    } catch (error) {
      console.error('Google Login Error:', error.message)
      setError('Google login failed. Please try again.')
    }
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <p className="text-red-600">{error}</p>
      <p className="text-green-600">{successMessage}</p>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        login to rogBlog
      </p>
      <Form className="my-8" onSubmit={submit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="abc@gmail.com"
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </LabelInputContainer>

        <Button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset] rounded-lg"
          type="submit"
        >
          Login &rarr;
          <BottomGradient />
        </Button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <Button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)] rounded-lg"
            type="submit"
            onClick={handleGoogleLogin}
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </Button>
        </div>
      </Form>
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  )
}

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  )
}
