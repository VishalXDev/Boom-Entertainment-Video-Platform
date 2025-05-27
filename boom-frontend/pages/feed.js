import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';

export default function Feed() {
  const { user, loading } = useContext(AuthContext);
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingFeed, setLoadingFeed] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (!loading) fetchVideos(page);
  }, [loading, page]);

  const fetchVideos = async (pageNum) => {
    setLoadingFeed(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/videos/feed?page=${pageNum}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      if (pageNum === 1) setVideos(data);
      else setVideos((prev) => [...prev, ...data]);
      if (data.length < 10) setHasMore(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFeed(false);
    }
  };

  if (loading) return <p className="p-4">Loading user...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Video Feed</h1>
      {videos.length === 0 && !loadingFeed && <p>No videos found.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {videos.map((video) => (
          <Link key={video._id} href={`/videos/${video._id}`}>
            <a className="border rounded-lg p-4 shadow hover:shadow-md transition">
              <h2 className="text-lg font-semibold">{video.title}</h2>
              <p className="text-gray-600 truncate">{video.description || 'No description'}</p>
              <div className="text-sm text-gray-500 mt-2">
                <p>By: {video.creator.username}</p>
                <p>Type: {video.type}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
      {loadingFeed && <p className="mt-4">Loading more videos...</p>}
      {hasMore && !loadingFeed && (
        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setPage((p) => p + 1)}
        >
          Load More
        </button>
      )}
    </div>
  );
}
