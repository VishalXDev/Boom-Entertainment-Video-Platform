import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/AuthContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VideoDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading } = useContext(AuthContext);

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [giftAmount, setGiftAmount] = useState('');
  const [commentText, setCommentText] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (id) fetchVideo();
  }, [id]);

  const fetchVideo = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/videos/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to fetch video');
      setVideo(data.video);
      setComments(data.comments);
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleGift = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!giftAmount || giftAmount <= 0) {
      setErrorMsg('Please enter a valid gift amount.');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/gifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ videoId: id, amount: giftAmount }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Gift failed');
      setSuccessMsg('Gift sent successfully!');
      setGiftAmount('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleComment = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    if (!commentText.trim()) {
      setErrorMsg('Comment cannot be empty.');
      return;
    }
    try {
      const res = await fetch(`${BACKEND_URL}/api/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ videoId: id, text: commentText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Comment failed');
      setComments((prev) => [...prev, data.comment]);
      setSuccessMsg('Comment posted!');
      setCommentText('');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  if (!video) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading video...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
        <p className="text-sm text-gray-600 mb-4">Uploaded by {video.uploader?.username || 'Unknown'}</p>

        <video controls className="w-full rounded mb-4 bg-black">
          <source src={video.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <p className="mb-4 text-gray-800">{video.description}</p>

        <div className="mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            Type: {video.type}
          </span>
          {video.type === 'long' && (
            <span className="ml-3 inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
              Price: ${video.price}
            </span>
          )}
        </div>

        {errorMsg && <p className="text-red-600 bg-red-100 px-4 py-2 rounded mb-2">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 bg-green-100 px-4 py-2 rounded mb-2">{successMsg}</p>}

        {/* Gift section */}
        {user && user._id !== video.uploader?._id && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Send Gift</h3>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="Amount (USD)"
                value={giftAmount}
                onChange={(e) => setGiftAmount(e.target.value)}
                className="border px-3 py-2 rounded w-40"
              />
              <button
                onClick={handleGift}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Send Gift
              </button>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div>
          <h2 className="text-lg font-bold mb-3">Comments</h2>

          {comments.length === 0 ? (
            <p className="text-gray-500 italic">No comments yet.</p>
          ) : (
            <ul className="space-y-3 mb-4">
              {comments.map((c) => (
                <li key={c._id} className="bg-gray-100 rounded px-4 py-2">
                  <p className="text-sm font-medium">{c.user?.username || 'Anonymous'}</p>
                  <p className="text-sm">{c.text}</p>
                </li>
              ))}
            </ul>
          )}

          {user && (
            <div className="mt-4">
              <textarea
                rows={3}
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full border px-3 py-2 rounded mb-2"
              />
              <button
                onClick={handleComment}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Post Comment
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
