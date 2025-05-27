import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { AuthContext } from '../context/AuthContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const { user, token } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${BACKEND_URL}/api/videos/feed`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen">
      <Head>
        <title>BOOM Entertainment | Feed</title>
        <meta
          name="description"
          content="Watch exclusive videos, support creators, and discover amazing content on BOOM Entertainment."
        />
      </Head>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            BOOM Entertainment
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover amazing content, connect with creators, and experience entertainment like never before
          </p>

          {!user && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-blue-600 hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 hover:border-white/50 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {user ? (
          <>
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.username}! 👋
                </h2>
                <p className="text-xl text-gray-600">
                  Discover fresh content curated just for you
                </p>
              </div>
              <Link
                href="/upload"
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Upload Video
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mb-4"></div>
                <p className="text-xl text-gray-600">Loading amazing content...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl" role="img" aria-label="clapperboard">🎬</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No videos yet!</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Be the first to share amazing content with the community. Upload your first video now!
                </p>
                <Link
                  href="/upload"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Upload First Video
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {videos.map((video) => (
                  <div
                    key={video._id}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={video.thumbnailUrl || '/placeholder.jpg'}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <span className="text-white text-2xl" role="img" aria-label="play">▶️</span>
                        </div>
                      </div>
                      {video.price > 0 && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ${video.price}
                        </div>
                      )}
                      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">
                        {video.type?.toUpperCase()}
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300 line-clamp-2">
                        {video.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">{video.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {video.creator?.username?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{video.creator?.username || 'Unknown'}</p>
                            <p className="text-sm text-gray-500">Creator</p>
                          </div>
                        </div>
                        <Link
                          href={`/videos/${video._id}`}
                          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium rounded-full hover:from-purple-600 hover:to-blue-600 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-0.5 text-sm"
                        >
                          Watch Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 max-w-4xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-6xl" role="img" aria-label="drama">🎭</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Join the Entertainment Revolution
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect with amazing creators, discover exclusive content, and be part of a vibrant community.
              Your entertainment journey starts here!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <Feature icon="🎬" title="Premium Content" desc="Access exclusive videos from top creators worldwide" />
              <Feature icon="💰" title="Earn & Support" desc="Support creators and earn rewards for engagement" />
              <Feature icon="🌟" title="Be Discovered" desc="Share your creativity and build your audience" />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-blue-600 hover:shadow-xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Your Journey
              </Link>
              <Link
                href="/login"
                className="px-8 py-4 border-2 border-purple-200 text-purple-600 font-semibold rounded-full hover:bg-purple-50 hover:border-purple-300 transition-all duration-300"
              >
                Already a Member?
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl" role="img" aria-label={title}>{icon}</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
