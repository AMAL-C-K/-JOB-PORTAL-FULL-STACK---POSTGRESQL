import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const data = await apiFetch("/applications/my-applications/");
      setApplications(data.results || data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getResumeUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;
  };

  if (loading) {
    return <h2 className="loading">Loading your applications...</h2>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the status of your job applications</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <h2>No Applications Yet</h2>
          <p>You haven't applied for any jobs yet.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div className="application-card" key={application.id}>
              <div className="application-header">
                <div>
                  <h2>{application.job_title}</h2>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={`status ${(application.status || "").toLowerCase()}`}>
                      {application.status}
                    </span>
                  </p>
                </div>
              </div>

              <div className="application-details">
                <p>
                  <strong>Applied On:</strong>{" "}
                  {application.applied_at
                    ? new Date(application.applied_at).toLocaleDateString()
                    : "Not available"}
                </p>

                {application.cover_letter && (
                  <div className="cover-letter">
                    <h3>Cover Letter</h3>
                    <p>{application.cover_letter}</p>
                  </div>
                )}

                {application.resume && (
                  <a
                    href={getResumeUrl(application.resume)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resume-link"
                  >
                    View My Resume
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyApplications;