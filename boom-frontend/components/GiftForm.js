import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function GiftForm({ videoId, toCreatorId, onGiftSent }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGiftSend = async (e) => {
    e.preventDefault();
    setError(null);

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('You must be logged in to send gifts.');

      const res = await fetch(`${API_BASE_URL}/api/gifts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          toCreator: toCreatorId,
          video: videoId,
          amount: numAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'Failed to send gift');

      setAmount('');
      onGiftSent(); // callback to parent component, e.g., refresh UI or show success toast
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleGiftSend} className="max-w-sm">
      <input
        type="number"
        min="1"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border p-2 rounded w-full mb-2"
        disabled={loading}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send Gift'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
