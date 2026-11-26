import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await axios.post(
                "https://fitzone-gym-management-gyax.onrender.com/api/auth/register",
                formData
            );

            if (response.data.success) {
                setSuccess(
                    response.data.message ||
                    "Registration successful. Please login."
                );

                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
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
                        Create Account
                    </h1>

                    <p className="text-zinc-500 mt-3">
                        Start your fitness journey with us.
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

                    {success && (
                        <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl px-4 py-3 mb-5 text-sm">
                            {success}
                        </div>
                    )}

                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
                        />
                    </div>

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
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-zinc-300 mb-2">
                            Phone
                        </label>

                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
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
                            placeholder="Create a password"
                            required
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-cyan-400 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-cyan-400 text-black py-3 rounded-xl font-bold hover:bg-cyan-300 transition disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                    <p className="text-center text-zinc-500 mt-6 text-sm">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-cyan-400 font-semibold hover:text-cyan-300"
                        >
                            Login
                        </Link>
                    </p>

                </form>

            </div>
        </div>
    );
}

export default Register;

