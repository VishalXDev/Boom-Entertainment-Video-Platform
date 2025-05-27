import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Upload() {
  const router = useRouter();
  const { user, loading } = useContext(AuthContext);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('short');
  const [price, setPrice] = useState(0);
  const [videoFile, setVideoFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'video/mp4') {
      setErrorMsg('Only .mp4 video files are allowed.');
      setVideoFile(null);
    } else {
      setErrorMsg('');
      setVideoFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Title is required.');
      return;
    }
    if (type === 'long' && price < 0) {
      setErrorMsg('Price must be zero or positive.');
      return;
    }
    if (!videoFile) {
      setErrorMsg('Please select a .mp4 video file to upload.');
      return;
    }

    setErrorMsg('');
    setUploading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('price', price);
    formData.append('videoFile', videoFile);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${BACKEND_URL}/api/videos/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.msg || 'Upload failed');

      setSuccessMsg('Video uploaded successfully! Redirecting...');
      setTimeout(() => {
        router.push(`/videos/${data.video._id}`);
      }, 2000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upload Video</h1>

      {errorMsg && <p className="text-red-600 mb-4">{errorMsg}</p>}
      {successMsg && <p className="text-green-600 mb-4">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1" htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            className="w-full border px-3 py-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={uploading}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="description">Description</label>
          <textarea
            id="description"
            className="w-full border px-3 py-2 rounded"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={uploading}
          />
        </div>

        <div>
          <label className="block font-semibold mb-1" htmlFor="type">Type *</label>
          <select
            id="type"
            className="w-full border px-3 py-2 rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
            disabled={uploading}
          >
            <option value="short">Short Video</option>
            <option value="long">Long Video (Paid)</option>
          </select>
        </div>

        {type === 'long' && (
          <div>
            <label className="block font-semibold mb-1" htmlFor="price">Price (USD)</label>
            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              className="w-full border px-3 py-2 rounded"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              disabled={uploading}
            />
          </div>
        )}

        <div>
          <label className="block font-semibold mb-1" htmlFor="videoFile">Video File (.mp4 only) *</label>
          <input
            id="videoFile"
            type="file"
            accept="video/mp4"
            onChange={handleFileChange}
            disabled={uploading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload Video'}
        </button>
      </form>
    </div>
  );
}
