import React, { useState } from 'react'
import { Link } from '@remix-run/react'
import { cn } from '../utils/cn.js'
import { Menu, MenuItem } from './ui/navbar-menu.jsx'
import { useDispatch, useSelector } from 'react-redux'
import authService from '../appwrite/auth.js'
import { logout as authLogout } from '../store/authSlice.js'

const Full_Screen_Navbar = ({ className }) => {
  const [active, setActive] = useState(null)
  const status = useSelector((state) => state.auth.status)
  const [isHydrated, setIsHydrated] = useState(false)
  const dispatch = useDispatch()

  const handelClick = async () => {
    try {
      const logout = await authService.logout()
      if (logout) {
        dispatch(authLogout())
      }
    } catch (error) {
      console.error('Logout failed', error)
    }
  }

  React.useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return null
  }

  return (
    <div
      className={cn('max-w-2xl mx-auto rounded-full', className)}
      style={{ scrollbarWidth: 'none' }}
    >
      <Menu setActive={setActive}>
        <Link to="/">
          <MenuItem setActive={setActive} active={active} item="Home" />
        </Link>
        <Link to="/addpost">
          <MenuItem setActive={setActive} active={active} item="AddPost" />
        </Link>
        <Link to="/addStory">
          <MenuItem setActive={setActive} active={active} item="AddStory" />
        </Link>
        <Link to="/Stories">
          <MenuItem setActive={setActive} active={active} item="Stories" />
        </Link>
        {status || (
          <div className="flex space-x-5">
            <Link to={'/login'}>
              <MenuItem setActive={setActive} active={active} item="Login" />
            </Link>
            <Link to={'/signup'}>
              <MenuItem setActive={setActive} active={active} item="Signup" />
            </Link>
          </div>
        )}
      </Menu>
    </div>
  )
}

export default Full_Screen_Navbar
