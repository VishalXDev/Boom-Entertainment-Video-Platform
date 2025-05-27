import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

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

  return (
    <>
      <header className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 backdrop-blur-sm border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo Section */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-300">
                BoomStream
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {user ? (
                <>
                  <NavLink href="/upload" icon="📤">Upload</NavLink>
                  <NavLink href="/profile" icon="👤">Profile</NavLink>
                  <NavLink href="/wallet" icon="💰">Wallet</NavLink>
                  <button 
                    onClick={logout} 
                    className="ml-4 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-full hover:from-red-600 hover:to-pink-600 hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink href="/login" icon="🔑">Login</NavLink>
                  <Link 
                    href="/register"
                    className="ml-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-purple-300 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-purple-500/20">
              <div className="flex flex-col space-y-2">
                {user ? (
                  <>
                    <MobileNavLink href="/upload" icon="📤">Upload</MobileNavLink>
                    <MobileNavLink href="/profile" icon="👤">Profile</MobileNavLink>
                    <MobileNavLink href="/wallet" icon="💰">Wallet</MobileNavLink>
                    <button 
                      onClick={logout} 
                      className="mt-2 mx-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <MobileNavLink href="/login" icon="🔑">Login</MobileNavLink>
                    <Link 
                      href="/register"
                      className="mx-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        {children}
      </main>
    </>
  );
}

// Desktop Navigation Link Component
function NavLink({ href, children, icon }) {
  return (
    <Link 
      href={href}
      className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 backdrop-blur-sm"
    >
      <span className="text-sm">{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  );
}

// Mobile Navigation Link Component
function MobileNavLink({ href, children, icon }) {
  return (
    <Link 
      href={href}
      className="flex items-center space-x-3 px-4 py-3 mx-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
    >
      <span>{icon}</span>
      <span className="font-medium">{children}</span>
    </Link>
  );
}

export default MyApp;