import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

export default function Login({ onLogin }) {
  const [data, setData] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      return setError("All fields are required.");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onLogin();
      navigate("/tasks");

    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isValid = data.email && data.password;

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa, #e4e8f0)",
      }}
    >
      <div
        className="card border-0 shadow-lg rounded-4 p-4"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div className="text-center mb-4">
          <h3 className="fw-bold">Welcome Back</h3>
          <p className="text-muted small mb-0">
            Login to continue to Notebook.
          </p>
        </div>

        {/* Fixed alert area (no layout shift) */}
        <div style={{ minHeight: "60px" }}>
          {successMessage && (
            <div className="alert alert-success py-2 small text-center">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="alert alert-danger py-2 small text-center">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-floating mb-3">
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Email"
              required
            />
            <label>Email Address</label>
          </div>

          <div className="form-floating mb-3">
            <input
              type={show ? "text" : "password"}
              name="password"
              value={data.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Password"
              required
            />
            <label>Password</label>
          </div>

          <div className="form-check mb-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="showPass"
              onChange={() => setShow(!show)}
            />
            <label htmlFor="showPass" className="form-check-label small">
              Show Password
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 rounded-3"
            disabled={!isValid || loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center mt-4 small">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-decoration-none fw-semibold">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
