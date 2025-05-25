import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

interface ApiError {
  response?: {
    data?: {
      msg?: string;
    };
  };
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as ApiError).response === 'object' &&
    (error as ApiError).response !== null
  );
}

export default function Upload() {
  const router = useRouter();
  const { user } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'short',
    url: '',
    price: 0,
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('type', form.type);
      if (form.type === 'short' && file) {
        formData.append('video', file);
      } else {
        formData.append('url', form.url);
        formData.append('price', String(form.price));
      }

      await API.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      router.push('/');
    } catch (err: unknown) {
      if (isApiError(err)) {
        setError(err.response?.data?.msg || 'Upload failed');
      } else {
        setError('Upload failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Upload a Video</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 border rounded"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="w-full p-2 border rounded"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        >
          <option value="short">Short-Form</option>
          <option value="long">Long-Form</option>
        </select>

        {form.type === 'short' ? (
          <input
            type="file"
            accept="video/mp4"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        ) : (
          <>
            <input
              type="text"
              placeholder="Video URL"
              className="w-full p-2 border rounded"
              value={form.url}
              onChange={e => setForm({ ...form, url: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price (₹)"
              className="w-full p-2 border rounded"
              value={form.price}
              onChange={e => setForm({ ...form, price: +e.target.value })}
            />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white w-full py-2 rounded hover:bg-gray-800"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  );
}
