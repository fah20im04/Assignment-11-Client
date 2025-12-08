import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "../Home/LoadingPage";

const IssueDetails = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

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
  }, [id]);
  console.log("Issue ID:", id);


  if (loading)
    return <LoadingPage></LoadingPage>
  if (!issue)
    return <p className="py-20 text-center text-red-500">Issue not found.</p>;

  return (
    <div className="max-w-4xl mx-auto py-14 px-4">
      <button onClick={() => navigate(-1)} className="btn mb-6">
        ← Go Back
      </button>

      <div className="bg-white shadow rounded-lg p-6">
        {/* Image */}
        {issue.image && (
          <img
            src={issue.image}
            alt={issue.title}
            className="w-full h-80 object-cover rounded mb-6"
          />
        )}

        {/* Title + Status */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-3xl font-bold">{issue.title}</h1>

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
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-700 mb-6">
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
        </div>

        {/* Description */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-gray-600">{issue.description}</p>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
