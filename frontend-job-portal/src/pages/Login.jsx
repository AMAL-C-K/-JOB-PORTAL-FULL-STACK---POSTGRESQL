import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous error
    setError("");

    // Validate fields
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiFetch("/token/", {
        method: "POST",
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      // Check login response
      if (!data.access || !data.refresh || !data.user) {
        setError("Invalid login response from server.");
        return;
      }

      // Save authentication data
      login(data.access, data.refresh, data.user);

      // Redirect according to role
      if (data.user?.role === "employer") {
        navigate("/employer-dashboard", { replace: true });
      } else {
        navigate("/jobs", { replace: true });
      }
    } catch (error) {
      // Keep error visible
      setError("Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Login to your account</p>

        {/* Error message */}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            disabled={loading}
            required
          />

          {/* Password */}
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            disabled={loading}
            required
          />

          {/* Login button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="auth-link">
          Don't have an account?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => navigate("/register")}
            disabled={loading}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;