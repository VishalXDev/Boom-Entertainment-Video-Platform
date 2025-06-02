import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Profile() {
  const { user, token, loading } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [purchased, setPurchased] = useState([]);
  const [purchasedLoading, setPurchasedLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('uploaded');

  useEffect(() => {
    if (user && token) {
      const fetchVideos = async () => {
        setVideosLoading(true);
        try {
          const res = await api.get('/videos/feed', {
            params: { creator: user._id },
            headers: { Authorization: `Bearer ${token}` },
          });
          setVideos(res.data.filter((v) => v.creator._id === user._id));
        } catch (err) {
          console.error('Error fetching uploaded videos:', err);
        } finally {
          setVideosLoading(false);
        }
      };

      const fetchPurchased = async () => {
        setPurchasedLoading(true);
        try {
          const res = await api.get('/videos/purchased', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPurchased(res.data);
        } catch (err) {
          console.error('Error fetching purchased videos:', err);
        } finally {
          setPurchasedLoading(false);
        }
      };

      fetchVideos();
      fetchPurchased();
    }
  }, [user, token]);

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatViews = (views) => {
    if (!views) return '0 views';
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M views`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K views`;
    return `${views} views`;
  };

  const getVideoThumbnail = (video) => {
    // Return placeholder or actual thumbnail
    return video.thumbnail || `https://picsum.photos/320/180?random=${video._id}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-300 rounded-lg mb-6"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-4">
                  <div className="h-40 bg-gray-300 rounded mb-3"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign in required</h2>
          <p className="text-gray-600 mb-6">Please log in to view your profile</p>
          <Link href="/login" className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 h-32 relative">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-6">
            {/* Avatar */}
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.username}</h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <span>{videos.length} videos</span>
                <span>{purchased.length} purchased</span>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  <span className="font-semibold">${user.wallet?.toFixed(2) ?? '0.00'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Link 
                href="/upload" 
                className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Upload Video</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('uploaded')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'uploaded'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                My Videos ({videos.length})
              </button>
              <button
                onClick={() => setActiveTab('purchased')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'purchased'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                Purchased ({purchased.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'uploaded' && (
          <div>
            {videosLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                    <div className="h-40 bg-gray-300"></div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No videos yet</h3>
                <p className="text-gray-600 mb-6">Upload your first video to get started</p>
                <Link 
                  href="/upload" 
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  Upload Video
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video) => (
                  <Link key={video._id} href={`/videos/${video._id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                      {/* Thumbnail */}
                      <div className="relative">
                        <img
                          src={getVideoThumbnail(video)}
                          alt={video.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {video.type === 'short-form' && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                            Short
                          </div>
                        )}
                        {video.price > 0 && (
                          <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            ${video.price.toFixed(2)}
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {video.description || 'No description'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatViews(video.views)}</span>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'purchased' && (
          <div>
            {purchasedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                    <div className="h-40 bg-gray-300"></div>
                    <div className="p-3">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : purchased.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No purchases yet</h3>
                <p className="text-gray-600 mb-6">Explore and purchase videos from creators</p>
                <Link 
                  href="/feed" 
                  className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  Browse Videos
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {purchased.map((video) => (
                  <Link key={video._id} href={`/videos/${video._id}`}>
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                      {/* Thumbnail */}
                      <div className="relative">
                        <img
                          src={getVideoThumbnail(video)}
                          alt={video.title}
                          className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                          Purchased
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                          {formatDuration(video.duration)}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-3">
                        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          by {video.creator?.username || 'Unknown'}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{formatViews(video.views)}</span>
                          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}