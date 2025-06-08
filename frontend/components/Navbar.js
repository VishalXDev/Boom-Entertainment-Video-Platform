import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Navbar() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [user, setUser] = useState(null) // Add user state for auth

  // Check if user is logged in (you'll need to implement this based on your auth system)
  useEffect(() => {
    // Replace this with your actual auth check
    const token = localStorage.getItem('token')
    if (token) {
      // You might want to decode the token or make an API call to get user info
      setUser({ name: 'User', avatar: null }) // Replace with actual user data
    }
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      router.push(`/?search=${encodeURIComponent(search.trim())}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/login')
  }

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Left Section - Logo and Menu */}
      <div className="flex items-center space-x-4">
        {/* Menu Button (for mobile responsiveness) */}
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 lg:hidden">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-1 hover:opacity-80 transition-opacity duration-200">
            <div className="bg-red-600 text-white px-3 py-1 rounded-md font-bold text-xl">
              BOOM&SHOOM
            </div>
          </a>
        </Link>
      </div>

      Center Section - Search Bar
      <div className="flex-1 max-w-2xl mx-8 hidden md:block">
        <form onSubmit={handleSearch} className="flex items-center">
          <div className={`flex items-center flex-1 border rounded-full overflow-hidden transition-all duration-200 ${
            isSearchFocused ? 'border-blue-500 shadow-md' : 'border-gray-300'
          }`}>
            <input
              type="text"
              className="flex-1 px-4 py-2 text-gray-900 placeholder-gray-500 bg-transparent outline-none"
              placeholder="Search videos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-gray-50 border-l border-gray-300 hover:bg-gray-100 transition-colors duration-200"
              title="Search"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
          
          {/* Voice Search Button */}
          <button
            type="button"
            className="ml-3 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            title="Search with your voice"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </form>
      </div>

      {/* Mobile Search Button */}
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 md:hidden">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>

      {/* Right Section - User Actions */}
      <div className="flex items-center space-x-2">
        {user ? (
          <>
            {/* Upload Button */}
            <Link href="/upload">
              <a className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200" title="Create">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </a>
            </Link>

            {/* Notifications */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative" title="Notifications">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Notification dot */}
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Avatar/Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {user.avatar ? (
                    <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full" />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || 'U'
                  )}
                </div>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link href="/profile">
                    <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                      Your Profile
                    </a>
                  </Link>
                  <Link href="/dashboard">
                    <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                      Dashboard
                    </a>
                  </Link>
                  <Link href="/settings">
                    <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                      Settings
                    </a>
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Login Button */}
            <Link href="/login">
              <a className="flex items-center space-x-2 px-4 py-2 border border-blue-500 text-blue-500 rounded-full hover:bg-blue-50 transition-all duration-200 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
              </a>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}