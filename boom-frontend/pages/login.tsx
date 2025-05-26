import { useState, useEffect } from "react";
import { Eye, EyeOff, Play, Zap, Star, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import API from "../services/api";

export default function Login() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", formData);
      Cookies.set("token", res.data.token);
      router.push("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { msg?: string } } };
        setError(axiosErr.response?.data?.msg || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
        <div
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        ></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-red-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Play className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            BOOM
          </span>
        </div>
        <div className="hidden md:flex space-x-8">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            About
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          {/* Left side */}
          <div className="space-y-8 text-center md:text-left">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Welcome to the{" "}
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                  Future
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Join millions of creators and viewers in the most innovative
                video platform ever built.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-md mx-auto md:mx-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">10M+</div>
                <div className="text-sm text-gray-400">Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-400">5M+</div>
                <div className="text-sm text-gray-400">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>

            <div className="space-y-3 max-w-md mx-auto md:mx-0">
              <div className="flex items-center space-x-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-300">Lightning-fast streaming</span>
              </div>
              <div className="flex items-center space-x-3">
                <Star className="w-5 h-5 text-purple-400" />
                <span className="text-gray-300">
                  AI-powered recommendations
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Play className="w-5 h-5 text-pink-400" />
                <span className="text-gray-300">4K quality streaming</span>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="w-full max-w-md mx-auto">
            <form
              onSubmit={handleSubmit}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-3xl font-bold">Sign In</h2>
                <p className="text-gray-400">Continue your journey with BOOM</p>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center">{error}</p>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-600 text-purple-500 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-300">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center pt-4">
                <p className="text-gray-400">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="text-purple-400 hover:text-purple-300 transition-colors font-semibold"
                  >
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
      <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
    </div>
  );
}
