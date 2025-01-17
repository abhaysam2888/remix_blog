import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import './tailwind.css'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import Small_Screen_Navbar from './components/Small_Screen_Navbar.jsx'
import Full_Screen_Navbar from './components/Full_Screen_Navbar.jsx'
import GetCurrentUser from './components/GetCurrentUser.jsx'

// Define links for fonts and other assets
export const links = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

// Layout component for consistent structure
export function Layout({ children }) {
  return (
    <html lang="en" className="dark bg-black">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-black">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

// Main App component wrapped with Redux Provider
export default function App() {
  return (
    <Provider store={store}>
      <GetCurrentUser />
      <div className="hidden max-sm:block">
        <Small_Screen_Navbar />
      </div>
      <div className="sticky mt-5 top-5 z-50 max-sm:hidden">
        <Full_Screen_Navbar />
      </div>
      <Outlet />
    </Provider>
  )
}
