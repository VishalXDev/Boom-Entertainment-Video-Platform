// components/Navbar.tsx
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center mb-6">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => router.push('/')}
      >
        🚀 BOOM
      </h1>
      <div className="flex gap-3 items-center">
        <button
          onClick={() => router.push('/upload')}
          className="bg-blue-600 px-3 py-1 rounded"
        >
          Upload
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
