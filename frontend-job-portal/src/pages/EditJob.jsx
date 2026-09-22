import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiFetch } from "../api/api";

function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "full_time",
    salary: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const data = await apiFetch(`/jobs/${jobId}/`);

      setFormData({
        title: data.title || "",
        description: data.description || "",
        location: data.location || "",
        job_type: data.job_type || "full_time",
        salary: data.salary !== null && data.salary !== undefined ? data.salary : "",
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
    setSaving(true);

    try {
      const dataToSend = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : null,
      };

      await apiFetch(`/jobs/${jobId}/`, {
        method: "PATCH",
        body: JSON.stringify(dataToSend),
      });

      navigate("/my-jobs");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <h2 className="loading">Loading job...</h2>;
  }

  return (
    <div className="container">
      <div className="form-card">
        <h1>Edit Job</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="7"
            required
          />

          <label htmlFor="location">Location</label>
          <input
            id="location"
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label htmlFor="job_type">Job Type</label>
          <select
            id="job_type"
            name="job_type"
            value={formData.job_type}
            onChange={handleChange}
          >
            <option value="full_time">Full Time</option>
            <option value="part_time">Part Time</option>
            <option value="internship">Internship</option>
          </select>

          <label htmlFor="salary">Salary</label>
          <input
            id="salary"
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditJob;