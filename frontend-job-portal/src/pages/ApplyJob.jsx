import { useState } from "react";
import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { apiFetch } from "../api/api";


function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const formData = new FormData();

    formData.append(
      "cover_letter",
      coverLetter
    );

    if (resume) {
      formData.append("resume",resume);
    }

    try {
      await apiFetch(
        `/applications/apply/${jobId}/`,
        {
          method: "POST",
          body: formData,
        }
      );

      navigate("/my-applications");

    } catch (error) {
        setError(error.message);

    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container">

      <div className="form-card">

        <h1>Apply for Job</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <label>
            Cover Letter
          </label>

          <textarea
            value={coverLetter}
            onChange={(e) =>
              setCoverLetter(e.target.value)
            }
            placeholder="Write your cover letter..."
            rows="8"
            required
          />

          <label>
            Upload Resume
          </label>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) =>
              setResume(e.target.files[0])
            }
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Submit Application"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default ApplyJob;