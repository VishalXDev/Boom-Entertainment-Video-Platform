import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
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
      .then((data) => {
        setVideos(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">BOOM Entertainment Feed</h1>

      {loading && <p>Loading videos...</p>}

      {!loading && videos.length === 0 && (
        <p>No videos available. Upload or explore later!</p>
      )}

      <ul className="space-y-6">
        {videos.map((video) => (
          <li
            key={video._id}
            className="border rounded p-4 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold">{video.title}</h2>
            <p>{video.description}</p>
            <p>
              Creator: {video.creator?.username || 'Unknown'} | Type: {video.type}{' '}
              {video.price > 0 && `(Price: $${video.price})`}
            </p>
            <Link href={`/videos/${video._id}`}>
              <a className="text-blue-600 hover:underline mt-2 inline-block">
                Watch / Details
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
