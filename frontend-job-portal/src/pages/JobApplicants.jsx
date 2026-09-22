import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const data = await apiFetch(`/applications/job/${jobId}/applicants/`);
      setApplications(data.results || data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (applicationId, newStatus) => {
    try {
      await apiFetch(`/applications/${applicationId}/status/`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      setApplications((prevApps) =>
        prevApps.map((application) =>
          application.id === applicationId
            ? { ...application, status: newStatus }
            : application
        )
      );
    } catch (error) {
      alert(error.message);
    }
  };

  const getResumeUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `http://127.0.0.1:8000${path}`;
  };

  if (loading) {
    return <h2 className="loading">Loading applicants...</h2>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <button className="back-button" onClick={() => navigate("/my-jobs")}>
          ← Back to My Jobs
        </button>
        <h1>Applicants</h1>
      </div>

      {error && <div className="error-message">{error}</div>}

      {applications.length === 0 ? (
        <div className="empty-state">
          <h2>No applications yet</h2>
          <p>No candidates have applied for this job yet.</p>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((application) => (
            <div className="application-card" key={application.id}>
              <div className="application-header">
                <div>
                  <h2>{application.candidate_username}</h2>
                  <p>
                    Status:{" "}
                    <span
                      className={`status ${(application.status || "").toLowerCase()}`}
                    >
                      {application.status}
                    </span>
                  </p>
                </div>

                <div className="application-actions">
                  <button
                    className="btn btn-success"
                    onClick={() => updateStatus(application.id, "accepted")}
                  >
                    Accept
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => updateStatus(application.id, "rejected")}
                  >
                    Reject
                  </button>
                </div>
              </div>

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
                  View Resume
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobApplicants;