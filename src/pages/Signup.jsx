import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/api";

export default function Signup() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    if (data.password !== data.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);

      await API.post("/auth/signup", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      navigate("/login", {
        state: { message: "Account created successfully. Please login." },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isValid =
    data.name && data.email && data.password && data.confirmPassword;

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
          <h3 className="fw-bold">Create Account</h3>
          <p className="text-muted small mb-0">
            Join Notebook and stay organized.
          </p>
        </div>

        {/* Error area (fixed height to prevent shifting) */}
        <div style={{ minHeight: "48px" }}>
          {error && (
            <div className="alert alert-danger py-2 small">
              {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>

          <div className="form-floating mb-3">
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Full Name"
              required
            />
            <label>Full Name</label>
          </div>

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

          <div className="form-floating mb-3 position-relative">
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

          <div className="form-floating mb-3 position-relative">
            <input
              type={show ? "text" : "password"}
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={handleChange}
              className="form-control"
              placeholder="Confirm Password"
              required
            />
            <label>Confirm Password</label>
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
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center mt-4 small">
            Already have an account?{" "}
            <Link to="/login" className="text-decoration-none fw-semibold">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
