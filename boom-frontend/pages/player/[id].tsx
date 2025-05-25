import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import API from '../../services/api';

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
}

export default function PlayerPage() {
  const router = useRouter();
  const { id } = router.query;

  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    API.get(`/videos/${id}`)
      .then(res => setVideo(res.data))
      .catch(() => setVideo(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">Loading video...</p>;
  if (!video) return <p className="p-4">Video not found.</p>;

  const { title, description, creator, type, url, videoUrl } = video;

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sm text-gray-600">by {creator?.username || 'Unknown'}</p>
      <p>{description}</p>

      {type === 'short' ? (
        <video src={videoUrl} controls className="w-full rounded" />
      ) : (
        <iframe
          src={convertToEmbed(url)}
          className="w-full aspect-video rounded"
          allowFullScreen
          title="Long form video"
        />
      )}
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
