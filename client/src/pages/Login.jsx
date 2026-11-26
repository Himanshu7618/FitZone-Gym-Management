import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "https://fitzone-gym-management-gyax.onrender.com/api/auth/login",
        formData
      );

      if (response.data.success) {
        const token = response.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("role", response.data.user.role);

        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-zinc-950 text-white flex items-center justify-center px-6 py-12">

      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <p className="text-cyan-400 font-bold tracking-[0.3em] mb-3">
            FITZONE
          </p>

          <h1 className="text-4xl font-black">
            Welcome Back
          </h1>

          <p className="text-zinc-500 mt-3">
            Login to continue your fitness journey.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
        >

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-zinc-300 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-400 text-black py-3 rounded-xl font-bold hover:bg-cyan-300 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-zinc-500 mt-6 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-cyan-400 font-semibold hover:text-cyan-300"
            >
              Register
            </Link>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;
