import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "../Home/LoadingPage";

const LatestResolvedIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/issues"); // fetch all issues
        setIssues(res.data);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  // Filter resolved & sort by createdAt descending
  const resolvedIssues = issues
    .filter((i) => i.status === "Resolved")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  if (loading) return <LoadingPage></LoadingPage>;
  if (resolvedIssues.length === 0)
    return <p className="text-center text-gray-500">No resolved issues yet.</p>;

  return (
    <div className="p-6 ">
      <h2 className="text-3xl font-bold mb-6">Latest Resolved Issues</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resolvedIssues.map((issue) => (
          <div
            key={issue._id}
            className="p-4 rounded-xl shadow hover:shadow-md transition bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 border border-green-600"
          >
            {issue.image && (
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-48 object-cover mb-3 rounded"
              />
            )}

            {/* Title with subtle success icon */}
            <h3 className="font-semibold text-lg flex items-center text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-600 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {issue.title}
            </h3>

            {/* Description */}
            <p className="text-sm mb-2 text-gray-700">{issue.description}</p>

            {/* Meta info */}
            <p className="text-gray-800">
              <span className="font-semibold">Category:</span> {issue.category}
            </p>
            <p className="text-gray-800">
              <span className="font-semibold">Location:</span> {issue.location}
            </p>

            {/* Action Button */}
            <div className="flex justify-between">
              <Link to={`/viewDetails/${issue._id}`}
                
                className="mt-3 bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-md transition"
              >
                View Details
              </Link>

              {/* Resolved Badge */}
              <div className="mt-3 inline-block bg-green-50 text-green-700  font-medium px-3 py-1 rounded-full border border-green-200">
                Issue Resolved
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestResolvedIssues;
