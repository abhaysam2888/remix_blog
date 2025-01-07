import React, { useState } from 'react'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { cn } from '../utils/cn'
import Button from '../components/Button'
import { IconBrandGoogle } from '@tabler/icons-react'
import authService from '../appwrite/auth'
import { useNavigate } from '@remix-run/react'

export const meta = () => {
  return [
    { title: 'Sign Up for rogBlog - Create Your Account' },
    {
      name: 'description',
      content:
        "Join rogBlog today! Create an account to explore, share, and connect with a vibrant blogging community. It's quick and easy to get started.",
    },
    {
      name: 'keywords',
      content:
        'rogBlog signup, create account, blogging platform, user registration, sign up page, join rogBlog',
    },
    {
      property: 'og:title',
      content: 'Sign Up for rogBlog - Create Your Account',
    },
    {
      property: 'og:description',
      content:
        'Create your rogBlog account to access a world of articles, share your thoughts, and connect with others. Sign up today!',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    { name: 'robots', content: 'index,follow' },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:title',
      content: 'Sign Up for rogBlog - Create Your Account',
    },
    {
      name: 'twitter:description',
      content:
        'Sign up to rogBlog and start sharing your ideas with a passionate community of bloggers.',
    },
  ]
}

export default function Signup() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { firstname, lastname, email, password } = formData

    // Validation
    if (!firstname || !lastname || !email || !password) {
      setError('All fields are required. Please fill out the form completely.')
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Invalid email address. Please enter a valid email.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    setError(null)
    setLoading(true)

    try {
      // Check if the user is logged in, then log them out first
      const currentUser = await authService.getCurrentUser()
      if (currentUser) await authService.logout()

      // Create new user account
      const user = await authService.createAccount({
        email,
        password,
        name: `${firstname} ${lastname}`,
      })

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      console.error('Error creating user:', err)
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await authService.createGoogleLogin()
      alert('Google login successful!')
      navigate('/')
    } catch (error) {
      console.error('Google Login Error:', error.message)
      setError('Google login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      {success ? (
        <SuccessMessage />
      ) : (
        <>
          <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
            Signup to rogBlog.live
          </p>
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          <form className="my-8" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
              <LabelInputContainer>
                <Label htmlFor="firstname">First name</Label>
                <Input
                  id="firstname"
                  placeholder="Name"
                  type="text"
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label htmlFor="lastname">Last name</Label>
                <Input
                  id="lastname"
                  placeholder="Surname"
                  type="text"
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                />
              </LabelInputContainer>
            </div>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                placeholder="abc@gmail.com"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </LabelInputContainer>
            <LabelInputContainer className="mb-4">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                placeholder="••••••••"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </LabelInputContainer>

            <Button
              className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign up →'}
              <BottomGradient />
            </Button>

            <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

            <div className="flex flex-col space-y-4">
              <Button
                className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                  Google
                </span>
                <BottomGradient />
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

const SuccessMessage = () => (
  <div className="text-center p-4 bg-green-100 border border-green-400 rounded-md">
    <h2 className="text-lg font-bold text-green-700">Signup Successful!</h2>
    <p className="text-green-600 mt-2">
      You have been registered successfully. Redirecting to the home page...
    </p>
  </div>
)

const BottomGradient = () => (
  <>
    <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>
)

const LabelInputContainer = ({ children, className }) => (
  <div className={cn('flex flex-col space-y-2 w-full', className)}>
    {children}
  </div>
)
