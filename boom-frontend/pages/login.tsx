import { useState, useEffect } from "react";
import API from "../services/api";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      Cookies.set("token", res.data.token);
      router.push("/");
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const axiosErr = err as { response?: { data?: { msg?: string } } };
        setError(axiosErr.response?.data?.msg || "Login failed");
      } else {
        setError("Login failed");
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white text-center">Login to Boom 🚀</h1>
        {error && <p className="text-red-400 text-center">{error}</p>}

        <div className="space-y-2">
          <label className="block text-sm text-white">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-white">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-2 rounded-lg shadow-md"
        >
          Log In
        </button>
      </form>
    </div>
  );
}
