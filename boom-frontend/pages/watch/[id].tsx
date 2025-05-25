import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../../services/api';
// Removed user import from useAuth because it's unused
// import { useAuth } from '../../context/AuthContext';

interface Comment {
  _id: string;
  text: string;
  user?: {
    username: string;
  };
}

interface Video {
  _id: string;
  type: 'short' | 'long';
  title: string;
  creator?: {
    username: string;
  };
  description: string;
  url: string;
  videoUrl?: string;
  comments?: Comment[];
  price: number;
  purchased?: boolean;
}

export default function WatchPage() {
  // Removed unused 'user'
  // const { user } = useAuth();

  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<Video | null>(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [giftAmount, setGiftAmount] = useState(0);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!id) return;
    API.get(`/videos/${id}`)
      .then(res => setVideo(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const postComment = async () => {
    if (!comment.trim()) return;
    await API.post('/comments', { videoId: id, text: comment });
    const res = await API.get(`/videos/${id}`);
    setVideo(res.data);
    setComment('');
  };

  const sendGift = async () => {
    if (!giftAmount || giftAmount < 1) return alert('Invalid amount');
    const res = await API.post('/gifts', { videoId: id, amount: giftAmount });
    setMsg(res.data.message || 'Gift sent!');
    setGiftAmount(0);
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!video) return <p className="p-4">Video not found.</p>;

  const {
    type,
    title,
    creator,
    description,
    url,
    videoUrl,
    comments,
    price,
    purchased,
  } = video;

  if (type === 'long' && price > 0 && !purchased) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">{title}</h1>
        <p>This is a paid video. Please purchase it to watch.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6 px-4 space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-sm text-gray-600">by {creator?.username}</p>
      <p>{description}</p>

      {type === 'short' ? (
        <video src={videoUrl} controls className="w-full rounded" />
      ) : (
        <iframe
          src={convertToEmbed(url)}
          className="w-full aspect-video rounded"
          allowFullScreen
        />
      )}

      <div className="mt-4">
        <label className="block mb-2 font-semibold">Gift the Creator 🎁</label>
        <input
          type="number"
          placeholder="₹ Amount"
          value={giftAmount}
          onChange={e => setGiftAmount(+e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={sendGift}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send Gift
        </button>
        {msg && <p className="text-green-600 mt-2">{msg}</p>}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-bold mb-2">💬 Comments</h3>
        <div className="space-y-2">
          {comments?.map((c: Comment) => (
            <div key={c._id} className="p-2 bg-gray-100 rounded">
              <p className="text-sm font-semibold">{c.user?.username}</p>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={postComment}
            className="bg-black text-white px-4 rounded"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

function convertToEmbed(url: string) {
  const youtubeMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/
  );
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}
