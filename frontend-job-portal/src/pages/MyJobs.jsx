import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const data = await apiFetch("/jobs/my-jobs/");
      setJobs(data.results || data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`/jobs/${jobId}/`, {
        method: "DELETE",
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <h2 className="loading">Loading your jobs...</h2>;
  }

  return (
    <div className="container">
      <div className="page-header dashboard-header">
        <div>
          <h1>My Jobs</h1>
          <p>Manage your job postings</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/create-job")}
        >
          + Create Job
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="job-grid">
        {jobs.length === 0 ? (
          <div className="empty-state">
            <h2>No jobs created yet</h2>
            <p>Start by creating your first job posting.</p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/create-job")}
            >
              Create Job
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <div className="job-card employer-job-card" key={job.id}>
              <h2>{job.title}</h2>
              <p>📍 {job.location}</p>
              <p>💼 {job.job_type}</p>
              <p>💰 {job.salary || "Negotiable"}</p>

              <div className="job-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/edit-job/${job.id}`)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/job/${job.id}/applicants`)}
                >
                  Applicants
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(job.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyJobs;