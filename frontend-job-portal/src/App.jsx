import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import MyApplications from "./pages/MyApplications";

import MyJobs from "./pages/MyJobs";
import CreateJob from "./pages/CreateJob";
import EditJob from "./pages/EditJob";
import JobApplicants from "./pages/JobApplicants";
import EmployerDashboard from "./pages/EmployerDashboard";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import "./App.css";

function AppContent() {
  const { user, isAuthenticated } = useAuth();

  const getInitialRedirect = () => {
    if (!isAuthenticated) return "/login";
    return user?.role === "employer" ? "/employer-dashboard" : "/jobs";
  };

  return (
    <>
      <Navbar />

      <Routes>
        {/* Root Route */}
        <Route
          path="/"
          element={<Navigate to={getInitialRedirect()} replace />}
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Candidate-only Routes */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute role="candidate">
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs/:jobId"
          element={
            <ProtectedRoute>
              <JobDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply/:jobId"
          element={
            <ProtectedRoute role="candidate">
              <ApplyJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="candidate">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Employer-only Routes */}
        <Route
          path="/employer-dashboard"
          element={
            <ProtectedRoute role="employer">
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-jobs"
          element={
            <ProtectedRoute role="employer">
              <MyJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-job"
          element={
            <ProtectedRoute role="employer">
              <CreateJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-job/:jobId"
          element={
            <ProtectedRoute role="employer">
              <EditJob />
            </ProtectedRoute>
          }
        />
        <Route
          path="/job/:jobId/applicants"
          element={
            <ProtectedRoute role="employer">
              <JobApplicants />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;