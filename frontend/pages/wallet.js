import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

export default function Wallet() {
  const { user, token, loading } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [adding, setAdding] = useState(false);
  const [amount, setAmount] = useState(10);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  // Fetch wallet transaction history
  useEffect(() => {
    if (user && token) {
      api.get('/wallet/history')
        .then((res) => setTransactions(res.data))
        .catch(console.error);
    }
  }, [user, token]);

  // Add funds handler
  const handleAddFunds = async () => {
    if (amount < 1) {
      setError('Amount must be at least ₹1.');
      return;
    }

    setAdding(true);
    setError('');
    setSuccess('');

    try {
      const res = await api.post('/wallet/add', { amount });

      setSuccess(`Successfully added ₹${amount.toFixed(2)} to wallet.`);

      // Update user wallet balance locally
      if (res.data && res.data.newBalance !== undefined) {
        user.wallet = res.data.newBalance;
      }

      // Refetch transaction history
      const txRes = await api.get('/wallet/history');
      setTransactions(txRes.data);

      setAmount(10);
      setSelectedAmount(null);
      setShowAddFunds(false);
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Failed to add funds.');
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'add':
      case 'deposit':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
      case 'purchase':
      case 'buy':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
        );
      case 'gift':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
    }
  };

  const formatTransactionType = (type) => {
    switch (type.toLowerCase()) {
      case 'add': return 'Money Added';
      case 'deposit': return 'Deposit';
      case 'purchase': return 'Video Purchase';
      case 'buy': return 'Purchase';
      case 'gift': return 'Gift Sent';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please log in to access your wallet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
          <p className="text-gray-600">Manage your Boom wallet and transaction history</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-red-500 to-red-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium mb-2">Available Balance</p>
              <h2 className="text-4xl font-bold mb-4">₹{user.wallet?.toFixed(2) ?? '0.00'}</h2>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowAddFunds(true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Add Money</span>
                </button>
              </div>
            </div>
            <div className="text-right">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Add Funds Modal */}
        {showAddFunds && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Add Money</h3>
                <button
                  onClick={() => {
                    setShowAddFunds(false);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Quick Amount Selection */}
              <div className="mb-6">
                <p className="text-gray-700 font-medium mb-3">Quick Select</p>
                <div className="grid grid-cols-3 gap-3">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => {
                        setAmount(quickAmount);
                        setSelectedAmount(quickAmount);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        selectedAmount === quickAmount
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      ₹{quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Custom Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    min="1"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                      setSelectedAmount(null);
                    }}
                    disabled={adding}
                  />
                </div>
              </div>

              {/* Success/Error Messages */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              )}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Add Funds Button */}
              <button
                onClick={handleAddFunds}
                disabled={adding || amount < 1}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {adding ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add ₹{amount.toFixed(2)}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            <p className="text-gray-600 mt-1">Your recent wallet activities</p>
          </div>

          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
                <p className="text-gray-600">Your transaction history will appear here once you start using your wallet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(tx.type)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{formatTransactionType(tx.type)}</h4>
                        <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${
                        tx.type.toLowerCase() === 'add' || tx.type.toLowerCase() === 'deposit'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}>
                        {tx.type.toLowerCase() === 'add' || tx.type.toLowerCase() === 'deposit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}