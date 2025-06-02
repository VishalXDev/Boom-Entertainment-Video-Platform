import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export default function Feed() {
  const { user, loading } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const observerTarget = useRef(null);

  // Infinite scroll implementation
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loadingFeed) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loadingFeed]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    if (!loading) {
      setError('');
      fetchVideos(page);
    }
  }, [loading, page]);

  const fetchVideos = async (pageNum) => {
    setLoadingFeed(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/videos/feed?page=${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch videos. Please try again.');

      const data = await res.json();
      if (pageNum === 1) setVideos(data);
      else setVideos((prev) => [...prev, ...data]);

      if (data.length < 10) setHasMore(false);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Something went wrong while loading videos.');
    } finally {
      setLoadingFeed(false);
    }
  };

  const getVideoThumbnail = (video) => {
    return video.thumbnail || `https://picsum.photos/320/180?random=${video._id}`;
  };

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

  const formatTimeAgo = (date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffTime = Math.abs(now - videoDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const filteredVideos = videos.filter(video => {
    if (filter === 'all') return true;
    if (filter === 'short') return video.type === 'short-form';
    if (filter === 'long') return video.type === 'long-form';
    if (filter === 'free') return video.price === 0;
    if (filter === 'paid') return video.price > 0;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4 animate-pulse"></div>
            <div className="flex space-x-4 mb-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-300 rounded-full w-20 animate-pulse"></div>
              ))}
            </div>
          </div>
          
          {/* Videos Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Discover</h1>
            {user && (
              <Link href="/upload">
                <button className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Create</span>
                </button>
              </Link>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'short', label: 'Shorts' },
              { key: 'long', label: 'Videos' },
              { key: 'free', label: 'Free' },
              { key: 'paid', label: 'Premium' },
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === filterOption.key
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredVideos.length === 0 && !loadingFeed && !error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600 mb-8">Be the first to share something amazing!</p>
            {user && (
              <Link href="/upload">
                <button className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition-colors">
                  Upload Your First Video
                </button>
              </Link>
            )}
          </div>
        )}

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVideos.map((video) => (
            <Link key={video._id} href={`/videos/${video._id}`}>
              <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={getVideoThumbnail(video)}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Overlay Badges */}
                  <div className="absolute top-2 left-2 flex space-x-2">
                    {video.type === 'short-form' && (
                      <div className="bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
                        Short
                      </div>
                    )}
                    {video.price > 0 && (
                      <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded font-medium">
                        Premium
                      </div>
                    )}
                  </div>

                  {/* Duration */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                  )}

                  {/* Price */}
                  {video.price > 0 && (
                    <div className="absolute bottom-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded font-medium">
                      ${video.price.toFixed(2)}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex space-x-3">
                    {/* Creator Avatar */}
                    <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {video.creator?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-red-600 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {video.creator?.username || 'Unknown Creator'}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 space-x-2">
                        <span>{formatViews(video.views)}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(video.createdAt)}</span>
                      </div>
                    </div>

                    {/* More Options */}
                    <div className="flex-shrink-0">
                      <button className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Loading More */}
        {loadingFeed && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="flex space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-300 rounded mb-2"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div
          ref={observerTarget}
          className="h-10 flex items-center justify-center mt-8"
        >
          {hasMore && !error && (
            <div className="text-gray-500 text-sm">
              {loadingFeed ? 'Loading more videos...' : 'Scroll for more'}
            </div>
          )}
        </div>

        {/* No More Content */}
        {!hasMore && videos.length > 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">You've reached the end! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
}