import { useState, useEffect } from "react";
import API from "../services/api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      Cookies.set("token", res.data.token);
      router.push("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { msg?: string } } };
        setError(axiosError.response?.data?.msg || "Registration failed");
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      router.replace("/");
    }
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-cyan-900/20 to-purple-900/20"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
          <div className="absolute top-3/4 right-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000"></div>
        </div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl mb-4 relative overflow-hidden">
              <span className="text-3xl font-black text-white">B</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full animate-shine"></div>
            </div>
            <h1 className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              BOOM
            </h1>
            <p className="text-gray-400 text-sm">Join the entertainment revolution</p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>

              <div className="relative">
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  Create Your Account
                </h2>
                <p className="text-gray-400 text-sm text-center mb-6">
                  Start your journey to creative freedom
                </p>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 mb-6 animate-shake">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <input
                      type="text"
                      placeholder="Choose a username"
                      className="relative w-full p-4 rounded-2xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 outline-none transition-all duration-300"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="relative w-full p-4 rounded-2xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 outline-none transition-all duration-300"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <input
                      type="password"
                      placeholder="Create a strong password"
                      className="relative w-full p-4 rounded-2xl bg-white/10 text-white placeholder-white/50 border border-white/20 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-400/20 outline-none transition-all duration-300"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        🚀 Join BOOM
                      </>
                    )}
                  </span>
                </button>

                <div className="text-center mt-6">
                  <p className="text-gray-400 text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-300"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </form>

          {/* Features */}
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
              <div className="text-2xl mb-2">🎬</div>
              <p className="text-xs text-gray-400">Create Content</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
              <div className="text-2xl mb-2">💰</div>
              <p className="text-xs text-gray-400">Earn Fairly</p>
            </div>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
              <div className="text-2xl mb-2">🌟</div>
              <p className="text-xs text-gray-400">Get Discovered</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(300%) skewX(-12deg); }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}