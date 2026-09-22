import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await apiFetch("/accounts/register/", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      login(data.access, data.refresh, data.user);

      setSuccess("Registration successful!");

      setTimeout(() => {
        if (data.user.role === "employer") {
          navigate("/employer-dashboard");
        } else {
          navigate("/jobs");
        }
      }, 800);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join the Job Portal</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="candidate">Job Seeker</option>
            <option value="employer">Employer</option>
          </select>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;