import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

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

  // Redirect if user is not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (!user) {
    // Optionally, show loading or null while redirecting
    return <p className="p-4">Redirecting to login...</p>;
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
    if (!title.trim()) return setErrorMsg('Title is required.');
    if (type === 'long' && price < 0) return setErrorMsg('Price must be non-negative.');
    if (!videoFile) return setErrorMsg('Select an .mp4 video file to upload.');

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    formData.append('price', price);
    formData.append('videoFile', videoFile);

    try {
      const res = await api.post('/videos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMsg('Video uploaded successfully!');
      // Optionally reset form:
      setTitle('');
      setDescription('');
      setType('short');
      setPrice(0);
      setVideoFile(null);

      setTimeout(() => router.push(`/videos/${res.data.video._id}`), 1500);
    } catch (err) {
      setErrorMsg(err.response?.data?.msg || err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold">Upload Video</h1>

        {errorMsg && <p className="text-red-600 bg-red-100 px-4 py-2 rounded">{errorMsg}</p>}
        {successMsg && <p className="text-green-600 bg-green-100 px-4 py-2 rounded">{successMsg}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-semibold mb-1">Title *</label>
            <input
              id="title"
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={uploading}
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold mb-1">Description</label>
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
            <label htmlFor="type" className="block font-semibold mb-1">Type *</label>
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
              <label htmlFor="price" className="block font-semibold mb-1">Price (USD)</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                className="w-full border px-3 py-2 rounded"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value) || 0)}
                disabled={uploading}
              />
            </div>
          )}

          <div>
            <label htmlFor="videoFile" className="block font-semibold mb-1">Video File (.mp4 only) *</label>
            <input
              id="videoFile"
              type="file"
              accept="video/mp4"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Video'}
          </button>
        </form>
      </div>
    </div>
  );
}
