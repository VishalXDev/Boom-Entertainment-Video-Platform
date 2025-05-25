import { useState, useEffect } from 'react';
import API from '../services/api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      Cookies.set('token', res.data.token);
      router.push('/');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { msg?: string } } };
        setError(axiosErr.response?.data?.msg || 'Login failed');
      } else {
        setError('Login failed');
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.replace('/');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md space-y-4 w-full max-w-md">
        <h1 className="text-xl font-bold">Login</h1>
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="bg-black text-white w-full py-2 rounded hover:bg-gray-800">
          Login
        </button>
      </form>
    </div>
  );
}
