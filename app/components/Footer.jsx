import { Link } from '@remix-run/react'
import React from 'react'
import { useSelector } from 'react-redux'

export default function Footer() {
  const userAuth = useSelector((state) => state.auth.status)
  return (
    <footer className="bg-black text-white py-8 border-[0.5px] border-t-[#1F2937] border-b-black border-l-black border-r-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Logo and Copyright */}
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2">
              <div className="bg-white text-black w-8 h-8 flex items-center justify-center rounded">
                rB
              </div>
              <span className="font-semibold text-lg">rogBlog Team</span>
            </div>
            <p className="text-sm mt-2">
              © copyright rogBlog 2025. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {/* Pages */}
            <div>
              <h3 className="text-sm font-bold mb-4">Pages</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/aboutUs" className="hover:underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contactUs" className="hover:underline">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacyPolicy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/termsOfServices" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Socials */}
            <div>
              <h3 className="text-sm font-bold mb-4">Socials</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="https://www.linkedin.com/in/abhay-verma-821699274/"
                    className="hover:underline"
                    target="_blank"
                  >
                    LinkedIn
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacyPolicy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/termsOfServices" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookiePolicy" className="hover:underline">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Register */}
            <div>
              <h3 className="text-sm font-bold mb-4">Account</h3>
              <ul className="space-y-2">
                {!userAuth && (
                  <li>
                    <Link to="/signup" className="hover:underline">
                      Sign Up
                    </Link>
                  </li>
                )}
                {!userAuth && (
                  <li>
                    <Link to="/login" className="hover:underline">
                      Login
                    </Link>
                  </li>
                )}
                {userAuth && (
                  <li>
                    <Link to="/forgotPassword" className="hover:underline">
                      Forgot Password
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
