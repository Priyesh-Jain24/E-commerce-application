import React, { useState, useContext } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import axios from "axios";                        // 👈 make sure this import is there
import { ShopContext } from "../context/ShopContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { backendURL, setToken} = useContext(ShopContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedPolicy) {
      alert("Please accept Terms & Conditions and Privacy Policy");
      return;
    }

    if (formData.password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };

      // 👇 your route: /api/users/register
      const res = await axios.post(
        `${backendURL}/api/users/register`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = res.data; // axios already parses JSON

      if (!data.success) {
        alert(data.message || "Registration failed");
        return;
      }

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      }
      console.log("REGISTERED USER:", data.user);
      alert("Registered successfully!");
      navigate("/"); // or "/login"
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      const msg =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      alert(msg);
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
          <p className="text-gray-600">Create your account and start shopping</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-300 focus:border-gray-700 outline-none"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Terms & Policy */}
            <div className="mb-6">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                  className="mr-2 mt-1"
                />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 no-underline"
                  >
                    Terms & Conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-gray-800 hover:text-gray-900 no-underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-700 text-white py-3 rounded-full font-medium hover:bg-gray-800 transition mb-4 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-gray-800 font-medium hover:text-gray-900 no-underline"
              >
                Login here
              </a>
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-800 no-underline">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
