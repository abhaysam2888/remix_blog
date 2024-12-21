
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from "@remix-run/react";
import authService from '../appwrite/auth'
import { logout as authLogout } from '../store/authSlice'

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Header() {
  
    const status = useSelector((state) => state.auth.status)
    const dispatch = useDispatch()
    const [isBarOpen, setIsBarOpen] = useState(false) 
    
    const handelClick = async() => {
        const logout = await authService.logout()
        if (logout) {
            dispatch(authLogout())
        }
    }
  return (
    <nav className="bg-white dark:bg-black sticky w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 mb-8">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <Link to={'/'}>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <img src="./favicon.ico" className="h-10" alt="codecorner Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white text-black">Codecorner</span>
                </div>
                </Link>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button onClick={() => setIsBarOpen(!isBarOpen)} data-collapse-toggle="navbar-sticky" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" d="M1 1h15M1 7h15M1 13h15"/>
                </svg>
            </button>
            </div>
            <div className={`items-center justify-between ${isBarOpen ? 'block' : "hidden"} w-full md:flex md:w-auto md:order-1`} id="navbar-sticky">
                <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                    <Link to={'/'}>
                    <li>
                        <p className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Home</p>
                    </li>
                    </Link>
                    <Link to={'/addpost'}>
                    <li>
                        <p className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Add Post</p>
                    </li>
                    </Link>
                    {
                        status ?
                        <li onClick={handelClick}>
                            <p className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Logout</p>
                        </li>
                        :
                        <div>
                            <Link to={'/login'}>
                    <li>
                        <p className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Login</p>
                    </li>
                    </Link>
                    <Link to={'/signup'}>
                    <li>
                        <p className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Signup</p>
                    </li>
                    </Link>
                        </div>
                    }
                </ul>
            </div>
            </div>
        </nav>
  );
}
