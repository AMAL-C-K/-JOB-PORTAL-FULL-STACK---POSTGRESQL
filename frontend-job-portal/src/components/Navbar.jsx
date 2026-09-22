import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const getLogoRedirect = () => {
    if (user?.role === "employer") return "/employer-dashboard";
    return "/jobs";
  };

  return (
    <nav className="navbar">
      <Link to={getLogoRedirect()} className="logo">
        JobPortal
      </Link>

      <div className="nav-links">
        {isAuthenticated ? (
          <>
            {/* Candidate Navbar */}
            {user?.role === "candidate" && (
              <>
                <Link to="/jobs">Jobs</Link>
                <Link to="/my-applications">My Applications</Link>
              </>
            )}

            {/* Employer Navbar */}
            {user?.role === "employer" && (
              <>
                <Link to="/employer-dashboard">Dashboard</Link>
                <Link to="/my-jobs">My Jobs</Link>
                <Link to="/create-job">Create Job</Link>
              </>
            )}

            <span className="username">Hi, {user?.username}</span>

            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Guest Navbar */}
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-primary">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;