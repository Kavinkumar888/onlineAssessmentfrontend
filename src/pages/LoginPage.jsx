import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("student@gmail.com");
  const [password, setPassword] = useState("student@123");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login(identifier, password);

      if (res.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/student");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-cyan-100 flex items-center justify-center px-4">

      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center bg-gradient-to-br from-blue-700 via-sky-600 to-cyan-500 text-white p-10">

          <h1 className="text-5xl font-bold mb-6">
            🎓 Online Examination
          </h1>

          <p className="text-lg leading-8 text-blue-100">
            Welcome to the Secure Online Examination Portal.
            <br />
            Attend exams securely, view results instantly,
            and manage everything from one place.
          </p>

          <div className="mt-10 space-y-4 text-lg">

            <div className="flex items-center gap-3">
              ✅ Secure Login
            </div>

            <div className="flex items-center gap-3">
              📝 Online Exams
            </div>

            <div className="flex items-center gap-3">
              📊 Instant Results
            </div>

            <div className="flex items-center gap-3">
              🔒 Protected Dashboard
            </div>

          </div>

        </div>

        {/* Right Side */}
        <div className="flex items-center p-10">

          <form
            onSubmit={handleSubmit}
            className="w-full"
          >

            <div className="text-center mb-8">

              <div className="text-6xl mb-4">
                🎓
              </div>

              <h2 className="text-3xl font-bold text-gray-800">
                Welcome Back
              </h2>

              <p className="text-gray-500 mt-2">
                Login to continue
              </p>

            </div>

            {error && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-xl p-3 mb-5">
                {error}
              </div>
            )}

            {/* Email */}

            <div className="mb-5">

              <label className="block mb-2 font-semibold text-gray-700">
                Email / Register Number
              </label>

              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter Email or Register Number"
                autoComplete="username"
                className="w-full rounded-xl border-2 border-gray-300 bg-white text-black placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />

            </div>

            {/* Password */}

            <div className="mb-6">

              <label className="block mb-2 font-semibold text-gray-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                autoComplete="current-password"
                className="w-full rounded-xl border-2 border-gray-300 bg-white text-black placeholder-gray-400 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />

            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 shadow-lg"
            >
              🔐 Login
            </button>

            <div className="mt-8 text-center text-gray-500 text-sm">
              © 2026 Online Examination Portal
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}