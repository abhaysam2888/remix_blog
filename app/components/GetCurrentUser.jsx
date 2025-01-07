import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { login, logout, rawData } from '../store/authSlice'
import authService from '../appwrite/auth' // Make sure this is correctly imported

const GetCurrentUser = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userData = await authService.getCurrentUser() // Fetch current user from the API or session
      if (userData) {
        dispatch(rawData(userData)) // Dispatch the raw user data
        if (userData.emailVerification !== false) {
          dispatch(login(userData)) // If user is valid, log them in
        }
      } else {
        dispatch(logout()) // If no user data, log them out
        dispatch(rawData(null)) // Clear raw user data
      }
    }

    fetchCurrentUser()
  }, [dispatch])

  return null // This component doesn't render anything, it just fetches and dispatches user data
}

export default GetCurrentUser
