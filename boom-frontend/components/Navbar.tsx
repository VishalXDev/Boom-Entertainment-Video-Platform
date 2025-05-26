import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1
        className="text-2xl font-extrabold tracking-wide cursor-pointer hover:text-yellow-400 transition"
        onClick={() => router.push('/')}
      >
        🚀 BOOM
      </h1>
      <div className="flex items-center gap-4">
        {user && (
          <span className="text-sm font-medium text-gray-300">
            Welcome, <span className="text-white font-semibold">{user.username}</span>
          </span>
        )}
        <button
          onClick={() => router.push('/upload')}
          className="bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Upload
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg text-sm font-semibold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
