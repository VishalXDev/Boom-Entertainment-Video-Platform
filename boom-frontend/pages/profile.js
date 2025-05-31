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

  useEffect(() => {
    if (user && token) {
      const fetchVideos = async () => {
        setVideosLoading(true);
        try {
          const res = await api.get('/videos/feed', {
            params: { creator: user._id },
            headers: { Authorization: `Bearer ${token}` },
          });
          // Filter to ensure videos created by this user
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

  if (loading) return <p className="p-4">Loading user...</p>;
  if (!user) return <p className="p-4">Please log in to see your profile.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="mb-6 p-4 border rounded bg-gray-50 space-y-1">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Wallet:</strong> ${user.wallet?.toFixed(2) ?? '0.00'}</p>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Uploaded Videos</h2>
      {videosLoading ? (
        <p>Loading uploaded videos...</p>
      ) : videos.length === 0 ? (
        <p>No videos uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {videos.map((video) => (
            <li
              key={video._id}
              className="border p-4 rounded shadow-sm hover:shadow transition"
            >
              <Link href={`/videos/${video._id}`}>
                <a>
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-sm text-gray-700">{video.description || 'No description'}</p>
                  <p className="text-sm">Type: {video.type}</p>
                  {video.price > 0 && (
                    <p className="text-sm">Price: ${video.price.toFixed(2)}</p>
                  )}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <h2 className="text-2xl font-semibold mt-10 mb-4">Purchased Videos</h2>
      {purchasedLoading ? (
        <p>Loading purchased videos...</p>
      ) : purchased.length === 0 ? (
        <p>You haven’t purchased any videos yet.</p>
      ) : (
        <ul className="space-y-4">
          {purchased.map((video) => (
            <li
              key={video._id}
              className="border p-4 rounded shadow-sm hover:shadow transition"
            >
              <Link href={`/videos/${video._id}`}>
                <a>
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p>{video.description || 'No description'}</p>
                  <p className="text-sm">Creator: {video.creator?.username || 'Unknown'}</p>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
