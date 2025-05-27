import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function VideoDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [error, setError] = useState(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMsg, setPurchaseMsg] = useState('');

  // Comments state
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState(null);

  useEffect(() => {
    if (!loading && id) {
      fetchVideoDetails();
      fetchComments();
    }
  }, [loading, id]);

  // Fetch video details
  const fetchVideoDetails = async () => {
    setLoadingVideo(true);
    setError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/videos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load video');
      const data = await res.json();
      setVideo(data.video);
      setHasPurchased(data.hasPurchased);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingVideo(false);
    }
  };

  // Fetch comments for video
  const fetchComments = async () => {
    setCommentError(null);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load comments');
      const data = await res.json();
      setComments(data);
    } catch (err) {
      setCommentError(err.message);
    }
  };

  // Add a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setCommentLoading(true);
    setCommentError(null);

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ videoId: id, text: newComment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to add comment');
      setNewComment('');
      fetchComments();
    } catch (err) {
      setCommentError(err.message);
    } finally {
      setCommentLoading(false);
    }
  };

  // Handle video purchase
  const handlePurchase = async () => {
    setPurchaseLoading(true);
    setPurchaseMsg('');
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/videos/${id}/purchase`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Purchase failed');
      setHasPurchased(true);
      setPurchaseMsg('Purchase successful!');
    } catch (err) {
      setPurchaseMsg(err.message);
    } finally {
      setPurchaseLoading(false);
    }
  };

  if (loading || loadingVideo) return <p>Loading video details...</p>;
  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!video) return null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Video Info */}
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <p className="mb-2 text-gray-700">{video.description || 'No description'}</p>
      <p className="mb-4 text-gray-600">By: {video.creator?.username || 'Unknown'}</p>
      <p className="mb-4 font-semibold">Type: {video.type}</p>

      {/* Video Player */}
      {video.type === 'short' && video.filePath && (
        <video controls className="w-full rounded shadow">
          <source src={`${API_BASE_URL}${video.filePath}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {/* Purchase or Watch for long videos */}
      {video.type === 'long' && (
        <>
          {video.price > 0 && !hasPurchased ? (
            <>
              <p className="mb-4 font-semibold text-red-600">
                Price: ${video.price.toFixed(2)}
              </p>
              <button
                onClick={handlePurchase}
                disabled={purchaseLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                aria-disabled={purchaseLoading}
                aria-label="Purchase Video"
              >
                {purchaseLoading ? 'Processing...' : 'Purchase Video'}
              </button>
              {purchaseMsg && (
                <p
                  className={`mt-2 ${
                    purchaseMsg.includes('successful') ? 'text-green-600' : 'text-red-600'
                  }`}
                  role="alert"
                >
                  {purchaseMsg}
                </p>
              )}
            </>
          ) : (
            <div className="mb-4">
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Watch Video
              </a>
            </div>
          )}
        </>
      )}

      {/* Comments Section */}
      <section className="mt-8" aria-label="Comments Section">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>

        {/* New comment form */}
        {user ? (
          <form onSubmit={handleAddComment} className="mb-6">
            <textarea
              className="w-full p-2 border rounded mb-2"
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={commentLoading}
              aria-label="Add a comment"
            />
            <button
              type="submit"
              disabled={commentLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {commentLoading ? 'Posting...' : 'Post Comment'}
            </button>
            {commentError && (
              <p className="text-red-600 mt-1" role="alert">
                {commentError}
              </p>
            )}
          </form>
        ) : (
          <p className="mb-6 italic text-gray-600">Log in to post comments.</p>
        )}

        {/* Comments List */}
        {comments.length === 0 && <p>No comments yet.</p>}
        <ul>
          {comments.map((c) => (
            <li key={c._id} className="mb-4 border-b border-gray-300 pb-2">
              <p className="font-semibold">{c.user?.username || 'Anonymous'}</p>
              <p>{c.text}</p>
              <p className="text-xs text-gray-500">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
{/* Gift Sending Section */}
<section className="mt-8" aria-label="Send Gift Section">
  <h2 className="text-2xl font-semibold mb-4">Send a Gift</h2>
  {user ? (
    <GiftForm
      videoId={id}
      toCreatorId={video.creator?._id}
      onGiftSent={() => alert('Gift sent!')}
    />
  ) : (
    <p className="italic text-gray-600">Log in to send gifts.</p>
  )}
</section>
