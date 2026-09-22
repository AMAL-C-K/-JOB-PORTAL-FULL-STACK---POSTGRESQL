import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    job_type: "full_time",
    salary: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const dataToSend = {
        ...formData,
        salary: formData.salary ? Number(formData.salary) : null,
      };

      await apiFetch("/jobs/", {
        method: "POST",
        body: JSON.stringify(dataToSend),
      });

      navigate("/my-jobs");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <h1>Create Job</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="e.g. React Developer"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe the job..."
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
            placeholder="e.g. Kochi"
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
            placeholder="e.g. 50000"
            value={formData.salary}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateJob;