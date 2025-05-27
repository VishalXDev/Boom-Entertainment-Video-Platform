import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import Link from 'next/link';
import { useContext } from 'react';
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

  return (
    <>
      <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          BoomStream
        </Link>
        <nav className="space-x-4">
          {user ? (
            <>
              <Link href="/upload">Upload</Link>
              <Link href="/profile">Profile</Link>
              <Link href="/wallet">Wallet</Link>
              <button onClick={logout} className="ml-2 bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </header>
      <main className="min-h-screen bg-gray-50">{children}</main>
    </>
  );
}

export default MyApp;
