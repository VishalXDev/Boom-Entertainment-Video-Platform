import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Link from 'next/link';
import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

function Layout({ children }) {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [router.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* YouTube-like Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left Section - Logo & Menu */}
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 md:hidden"
              >
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold text-gray-900 hidden sm:block">
                  Boom<span className="text-red-600">Stream</span>
                </span>
              </Link>
            </div>

            {/* Center Section - Search */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <form onSubmit={handleSearch} className="flex">
                <div className={`flex-1 relative ${isSearchFocused ? 'ring-2 ring-blue-500' : ''} rounded-l-full border border-gray-300 border-r-0`}>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full px-4 py-2 rounded-l-full outline-none text-gray-900 placeholder-gray-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-50 border border-gray-300 border-l-0 rounded-r-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Right Section - User Actions */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search Button */}
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 md:hidden">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {user ? (
                <>
                  {/* Create Button */}
                  <Link
                    href="/upload"
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="font-medium">Create</span>
                  </Link>

                  {/* Notifications */}
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm hover:shadow-lg transition-all duration-200"
                    >
                      {user.username?.charAt(0).toUpperCase() || 'U'}
                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                              {user.username?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{user.username}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <DropdownLink href="/profile" icon="👤">Your Profile</DropdownLink>
                          <DropdownLink href="/wallet" icon="💰">Wallet</DropdownLink>
                          <DropdownLink href="/upload" icon="📤">Upload Video</DropdownLink>
                          <DropdownLink href="/settings" icon="⚙️">Settings</DropdownLink>
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={logout}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                          >
                            <span>🚪</span>
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-full font-medium transition-colors duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="flex">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-l-full outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-50 border border-gray-300 border-l-0 rounded-r-full hover:bg-gray-100"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-4">
              {user ? (
                <div className="space-y-2">
                  <MobileNavLink href="/" icon="🏠">Home</MobileNavLink>
                  <MobileNavLink href="/upload" icon="📤">Upload</MobileNavLink>
                  <MobileNavLink href="/profile" icon="👤">Your Profile</MobileNavLink>
                  <MobileNavLink href="/wallet" icon="💰">Wallet</MobileNavLink>
                  <MobileNavLink href="/settings" icon="⚙️">Settings</MobileNavLink>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 mt-4"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <MobileNavLink href="/" icon="🏠">Home</MobileNavLink>
                  <MobileNavLink href="/login" icon="🔑">Sign In</MobileNavLink>
                  <MobileNavLink href="/register" icon="✨">Sign Up</MobileNavLink>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>

      {/* Click outside handler for dropdowns */}
      {(showUserMenu || isMobileMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setIsMobileMenuOpen(false);
          }}
        />
      )}
    </>
  );
}

// Dropdown Link Component
function DropdownLink({ href, children, icon }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
    >
      <span>{icon}</span>
      <span>{children}</span>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ href, children, icon }) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
    >
      <span>{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  );
}

export default MyApp;