import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import api from '../services/api';
import { useAuth } from '../Context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        formData
      );

      if (response.data.success) {
        const { token, user } = response.data;

        login(token, user);

        toast.success("Login successful");

        if (user.accountType === "Admin") {
          navigate("/admin");
        } else if (user.accountType === "Instructor") {
          navigate("/instructor");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary">
            Lecture Scheduler
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white hover:opacity-90 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;