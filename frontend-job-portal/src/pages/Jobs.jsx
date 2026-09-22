import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

function Jobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const data = await apiFetch(
        `/jobs/?search=${encodeURIComponent(search)}`
      );

      setJobs(data.results || data);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 className="loading">
        Loading jobs...
      </h2>
    );
  }

  return (
    <div className="container">

      <div className="page-header">
        <h1>Available Jobs</h1>
        <p>Find your next opportunity</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Job Search */}
      <div className="job-search">
        <input
          type="text"
          placeholder="Search by job title, location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="btn btn-primary"
          onClick={fetchJobs}
        >
          Search
        </button>
      </div>

      <div className="job-grid">

        {jobs.length === 0 ? (
          <p>No jobs available.</p>
        ) : (
          jobs.map((job) => (

            <div
              className="job-card"
              key={job.id}
            >

              <h2>{job.title}</h2>

              <p>
                📍 {job.location}
              </p>

              <p>
                💼 {job.job_type}
              </p>

              <p>
                💰 {job.salary || "Negotiable"}
              </p>

              <p>
                📅 Posted:{" "}
                {new Date(job.created_at).toLocaleDateString()}
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate(`/jobs/${job.id}`)
                }
              >
                View Details
              </button>

            </div>

          ))
        )}

      </div>

    </div>
  );
}

export default Jobs;
