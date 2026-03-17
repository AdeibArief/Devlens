import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ userName: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      register(form.userName, form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Something is wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="card w-full max-w-md bg-base-200 shadow-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="form-control">
            <span className="label-text mb-2">Username</span>
            <input
              type="text"
              name="userName"
              onChange={handleChange}
              className="input input-bordered w-full"
              value={form.userName}
              required
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-2">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              required
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
          <label className="form-control">
            <span className="label-text mb-2">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              required
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary w-full mt-2 "
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              "Register"
            )}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-semibold">
            Login
          </Link>
        </p>

        
      </div>
    </div>
  );
};

export default Register;
