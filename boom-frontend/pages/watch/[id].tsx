import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../../services/api';
import Layout from '../../components/Layout';

interface Comment {
  _id: string;
  text: string;
  user?: { username: string };
}

interface Video {
  _id: string;
  type: 'short' | 'long';
  title: string;
  creator?: { username: string };
  description: string;
  url: string;
  videoUrl?: string;
  comments?: Comment[];
  price: number;
  purchased?: boolean;
}

export default function WatchPage() {
  const router = useRouter();
  const { id } = router.query;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [giftAmount, setGiftAmount] = useState(0);
  const [msg, setMsg] = useState('');

  const fetchVideo = async () => {
    const res = await API.get(`/videos/${id}`);
    setVideo(res.data);
  };

  useEffect(() => {
    if (!id) return;
    fetchVideo().finally(() => setLoading(false));
  }, [id]);

  const postComment = async () => {
    if (!comment.trim()) return;
    await API.post('/comments', { videoId: id, text: comment });
    await fetchVideo();
    setComment('');
  };

  const sendGift = async () => {
    if (!giftAmount || giftAmount < 1) return alert('Invalid amount');
    const res = await API.post('/gifts', { videoId: id, amount: giftAmount });
    setMsg(res.data.message || 'Gift sent!');
    setGiftAmount(0);
  };

  if (loading) return <Layout><p className="p-4">Loading...</p></Layout>;
  if (!video) return <Layout><p className="p-4">Video not found.</p></Layout>;

  const { type, title, creator, description, url, videoUrl, comments, price, purchased } = video;

  if (type === 'long' && price > 0 && !purchased) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="text-gray-300">This is a paid video. Please purchase it to watch.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-6 px-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-gray-400">by {creator?.username || 'Unknown'}</p>
          <p className="text-gray-300 mt-1">{description}</p>
        </div>

        <div className="rounded-xl overflow-hidden">
          {type === 'short' ? (
            <video src={videoUrl} controls className="w-full rounded-lg bg-black" />
          ) : (
            <iframe
              src={convertToEmbed(url)}
              className="w-full aspect-video rounded-lg"
              allowFullScreen
              title="Long form video"
            />
          )}
        </div>

        {/* Gifting */}
        <div>
          <label className="block mb-2 font-semibold">🎁 Gift the Creator</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="₹ Amount"
              value={giftAmount}
              onChange={e => setGiftAmount(+e.target.value)}
              className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
            <button
              onClick={sendGift}
              className="bg-blue-600 px-4 py-2 rounded-lg font-medium"
            >
              Send
            </button>
          </div>
          {msg && <p className="text-green-400 mt-2">{msg}</p>}
        </div>

        {/* Comments */}
        <div>
          <h3 className="text-lg font-bold mb-3">💬 Comments</h3>
          <div className="space-y-2">
            {comments?.map((c) => (
              <div key={c._id} className="p-3 bg-gray-800 rounded-lg">
                <p className="text-sm font-semibold">{c.user?.username}</p>
                <p className="text-gray-300">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
            />
            <button
              onClick={postComment}
              className="bg-black text-white px-4 rounded-lg"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function convertToEmbed(url: string) {
  const youtubeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (youtubeMatch) return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  return url;
}
