import { useEffect, useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { apiFetch } from "../api/api";


function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const data = await apiFetch(
        `/jobs/${jobId}/`
      );

      setJob(data);

    } catch (error) {
      setError(error.message);

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <h2 className="loading">
        Loading job details...
      </h2>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  if (!job) {
    return null;
  }

  return (
    <div className="container">

      <div className="job-details">

        <button
          className="back-button"
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>

        <h1>{job.title}</h1>

        <div className="job-info">

          <p>
            <strong>Location:</strong>{" "}
            {job.location}
          </p>

          <p>
            <strong>Job Type:</strong>{" "}
            {job.job_type}
          </p>

          <p>
            <strong>Salary:</strong>{" "}
            {job.salary || "Negotiable"}
          </p>

          <p>
            <strong>Posted By:</strong>{" "}
            {job.employer_username}
          </p>

        </div>

        <div className="job-description">

          <h2>Job Description</h2>

          <p>{job.description}</p>

        </div>

        {user?.role === "candidate" && (
          <button
            className="btn btn-primary apply-button"
            onClick={() =>
              navigate(`/apply/${job.id}`)
            }
          >
            Apply Now
          </button>
        )}

      </div>

    </div>
  );
}

export default JobDetails;