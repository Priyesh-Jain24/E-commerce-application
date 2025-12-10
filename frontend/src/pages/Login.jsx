import React, { useContext, useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { ShopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setToken,  backendURL } = useContext(ShopContext);
  const navigate = useNavigate();

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${backendURL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      // ✅ Backend error handling
      if (!res.ok || !data.success) {
        alert(data.message || "Login failed");
        return;
      }
      console.log("LOGIN SUCCESS:", data);
      // ✅ Save token
      setToken(data.token);
      localStorage.setItem("token", data.token);
      console.log("SAVED TOKEN:", data.token);

      // ✅ Save user info (optional but recommended)
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // ✅ Redirect after login
      navigate("/");

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif text-gray-800 mb-2">AQUALIFE</h1>
          <p className="text-gray-600">Welcome back! Login to your account</p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

          {/* ✅ FORM */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 outline-none"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between mb-6">
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-gray-700 hover:text-gray-900 no-underline">
                Forgot password?
              </a>
            </div>

            {/* ✅ Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition mb-4 disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-gray-800 font-medium hover:text-gray-900 no-underline">
                Create one
              </a>
            </div>

          </form>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-800 no-underline">← Back to Home</a>
        </div>

      </div>
    </div>
  );
};

export default Login;
