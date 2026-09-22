import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api";
import { useAuth } from "../context/AuthContext";

function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyJobs = async () => {
      try {
        const data = await apiFetch("/jobs/my-jobs/");
        setJobs(data.results || data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMyJobs();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">

        <Link to="/create-job" className="btn btn-primary">
          + Create Job
        </Link>
      </div>

      <div className="dashboard-card">

        {loading && <p>Loading your jobs...</p>}

        {error && <div className="error-message">{error}</div>}

        {!loading && !error && jobs.length === 0 && (
          <div className="empty-state">
            <h3>No jobs posted yet</h3>
            <p>Create your first job posting.</p>
            <Link to="/create-job" className="btn btn-primary">
              Create Job
            </Link>
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="job-grid">
            {jobs.map((job) => (
              <div className="job-card" key={job.id}>
                <h3>{job.title}</h3>
                <p>📍 {job.location}</p>
                <p>💼 {job.job_type}</p>
                <p> {job.salary}</p>

                <div className="job-actions">
                  <Link to={`/jobs/${job.id}`} className="btn btn-secondary">
                    View
                  </Link>
                  <Link to={`/edit-job/${job.id}`} className="btn btn-primary">
                    Edit
                  </Link>
                  <Link
                    to={`/job/${job.id}/applicants`}
                    className="btn btn-success"
                  >
                    Applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default EmployerDashboard;