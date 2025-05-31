import { useContext, useEffect, useState } from 'react';
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

  if (loading) return <p className="p-4 text-center text-gray-600">Loading user...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Video Feed</h1>

      {error && (
        <p className="mb-4 text-red-600 bg-red-100 px-4 py-2 rounded text-center">{error}</p>
      )}

      {videos.length === 0 && !loadingFeed && !error && (
        <p className="text-center text-gray-500">No videos found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Link key={video._id} href={`/videos/${video._id}`} passHref>
            <a
              className="border rounded-lg p-4 shadow hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`View details for ${video.title}`}
            >
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-gray-600 truncate">{video.description || 'No description'}</p>
              <div className="text-sm text-gray-500 mt-2">
                <p>By: {video.creator?.username || 'Unknown'}</p>
                <p>Type: {video.type}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>

      {loadingFeed && <p className="mt-4 text-center text-gray-600">Loading more videos...</p>}

      {hasMore && !loadingFeed && !error && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={loadingFeed}
            className="bg-blue-600 disabled:bg-blue-400 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
