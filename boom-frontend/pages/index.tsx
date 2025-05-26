import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import Layout from "../components/Layout";

interface Video {
  _id: string;
  title: string;
  type: "short" | "long";
  videoUrl?: string;
  url?: string;
  price?: number;
  purchased?: boolean;
  creator: {
    username: string;
  };
}

export default function IndexPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
    try {
      const res = await API.get<Video[]>("/videos/feed");
      setVideos(res.data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch videos", err);
      setError("Failed to load videos.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
    try {
      const res = await API.get<{ wallet: number }>("/auth/me");
      setWallet(res.data.wallet);
    } catch (err) {
      console.error("Failed to fetch wallet", err);
      setWallet(0);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setLoading(true);
        fetchVideos();
        fetchWallet();
      } else {
        setError("Please log in to see videos.");
        setLoading(false);
      }
    }
  }, [authLoading, user]);

  const handlePurchase = async (videoId: string) => {
    try {
      const res = await API.post(`/videos/${videoId}/purchase`);
      alert(res.data.msg || res.data.message || "Purchase successful!");
      fetchVideos();
      fetchWallet();
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof (error as { response?: { data?: { message?: string } } }).response === "object" &&
        (error as { response?: { data?: { message?: string } } }).response !== null
      ) {
        alert(
          (error as { response: { data: { message: string } } }).response.data.message
        );
      } else {
        alert("Error purchasing video");
      }
    }
  };

  function extractYouTubeId(url: string) {
    const match = url.match(
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
    );
    return match ? match[1] : "";
  }

  if (authLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto p-4 text-center text-white">
          Loading authentication...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-white">
          🎬 Boom Feed
        </h1>
        <h2 className="text-xl font-semibold text-center text-green-400">
          💰 Wallet Balance: ₹{wallet}
        </h2>

        {loading && <p className="text-white">Loading videos...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && videos.length === 0 && <p>No videos found.</p>}

        {videos.map((video) => {
          const shortVideoUrl =
            video.type === "short" && video.videoUrl
              ? video.videoUrl.startsWith("http")
                ? video.videoUrl
                : `http://localhost:5000${video.videoUrl}`
              : undefined;

          return (
            <div
              key={video._id}
              className="border rounded-2xl p-4 shadow-lg bg-white text-gray-900 space-y-3 transition hover:shadow-xl"
            >
              <p className="text-xs text-gray-500 italic">
                by {video.creator.username}
              </p>
              <h2 className="text-lg font-semibold text-gray-800">
                {video.title}
              </h2>

              {video.type === "short" ? (
                <video
                  src={shortVideoUrl}
                  controls
                  muted
                  className="w-full rounded"
                  preload="metadata"
                />
              ) : (
                <div className="w-full">
                  <img
                    src={`https://img.youtube.com/vi/${extractYouTubeId(
                      video.url || ""
                    )}/0.jpg`}
                    alt="Thumbnail"
                    className="w-full rounded mb-2"
                  />

                  {video.price && video.price > 0 && !video.purchased ? (
                    <button
                      onClick={() => handlePurchase(video._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Buy for ₹{video.price}
                    </button>
                  ) : (
                    <button
                      onClick={() => router.push(`/watch/${video._id}`)}
                      className="bg-black text-white px-4 py-2 rounded"
                    >
                      Watch
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
