import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Wallet() {
  const { user, token, loading } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState(10);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user && token) {
      api.get('/wallet/history')
        .then((res) => setTransactions(res.data))
        .catch(console.error);
    }
  }, [user, token]);

  const handleAddFunds = async () => {
    setAdding(true);
    try {
      await api.post('/wallet/add', { amount });
      setSuccess(`Successfully added $${amount.toFixed(2)} to wallet.`);
      setTimeout(() => location.reload(), 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;
  if (!user) return <p className="p-4">Please log in to access your wallet.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
      <p className="mb-2">Current Balance: <strong>${user.wallet?.toFixed(2) ?? '0.00'}</strong></p>

      <div className="mb-6">
        <label className="block mb-1 font-medium">Add Funds</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="1"
            className="border px-3 py-1 rounded w-32"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
          <button
            onClick={handleAddFunds}
            disabled={adding}
            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            {adding ? 'Adding...' : 'Add Funds'}
          </button>
        </div>
        {success && <p className="text-green-600 mt-2">{success}</p>}
      </div>

      <h2 className="text-xl font-semibold mb-2">Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No wallet transactions yet.</p>
      ) : (
        <ul className="space-y-2">
          {transactions.map((tx) => (
            <li key={tx._id} className="border p-3 rounded bg-white shadow-sm">
              <p><strong>{tx.type}</strong> of ${tx.amount.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
