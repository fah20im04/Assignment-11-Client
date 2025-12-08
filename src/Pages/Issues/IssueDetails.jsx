import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure"; 
import LoadingPage from "../Home/LoadingPage"; 
import { AuthContext } from "../../Contexts/AuthContext"; 

const IssueDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [boosting, setBoosting] = useState(false);

  useEffect(() => {

    const fetchIssue = async () => {
      try {
        const res = await axiosSecure.get(`/issues/${id}`);
        setIssue(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id, user]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      try {
        await axiosSecure.delete(`/issues/${id}`);
        alert("Issue deleted successfully");
        navigate("/my-issues");
      } catch (err) {
        console.error(err);
        alert("Failed to delete issue");
      }
    }
  };

  const handleBoost = async () => {
    if (boosting) return;
    setBoosting(true);

    
    const confirmPayment = window.confirm(
      "Pay 100tk to boost this issue priority?"
    );

    if (!confirmPayment) {
      setBoosting(false);
      return;
    }

    try {
      const res = await axiosSecure.patch(`/issues/boost/${id}`); 
      setIssue(res.data); 
      alert("Issue boosted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to boost issue");
    } finally {
      setBoosting(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (!issue)
    return <p className="py-20 text-center text-red-500">Issue not found.</p>;

  const isOwner = user && user.email === issue.userEmail;
  const canEdit = isOwner && issue.status === "Pending";
  const canBoost = !isOwner && issue.priority !== "High";

  return (
    <div className="max-w-4xl mx-auto py-14 px-4">
      <button onClick={() => navigate(-1)} className="btn mb-6">
        ← Go Back
      </button>

      <div className="bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Image */}
        {issue.image && (
          <img
            src={issue.image}
            alt={issue.title}
            className="w-full h-80 object-cover rounded mb-6"
          />
        )}

        {/* Title + Status + Priority */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <h1 className="text-3xl font-bold">{issue.title}</h1>
          <div className="flex gap-2 flex-wrap">
            <span
              className={`px-4 py-1 rounded-full text-white font-semibold ${
                issue.status === "Pending"
                  ? "bg-yellow-500"
                  : issue.status === "In-Progress"
                  ? "bg-blue-500"
                  : issue.status === "Resolved"
                  ? "bg-green-600"
                  : "bg-gray-700"
              }`}
            >
              {issue.status}
            </span>
            <span
              className={`px-4 py-1 rounded-full text-white font-semibold ${
                issue.priority === "High" ? "bg-red-600" : "bg-gray-500"
              }`}
            >
              {issue.priority} Priority
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700">
          <p>
            <span className="font-semibold">Category:</span> {issue.category}
          </p>
          <p>
            <span className="font-semibold">Location:</span> {issue.location}
          </p>
          <p>
            <span className="font-semibold">Created At:</span>{" "}
            {new Date(issue.createdAt).toLocaleString()}
          </p>
          <p>
            <span className="font-semibold">Last Updated:</span>{" "}
            {new Date(issue.updatedAt).toLocaleString()}
          </p>
          {issue.assignedStaff && (
            <p>
              <span className="font-semibold">Assigned Staff:</span>{" "}
              {issue.assignedStaff.name} ({issue.assignedStaff.email})
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-600">{issue.description}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          {canEdit && (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => navigate(`/edit-issue/${id}`)}
            >
              Edit Issue
            </button>
          )}
          {isOwner && (
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete Issue
            </button>
          )}
          {canBoost && (
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              onClick={handleBoost}
              disabled={boosting}
            >
              {boosting ? "Boosting..." : "Boost Priority (100tk)"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
