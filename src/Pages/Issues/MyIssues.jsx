import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "../Home/LoadingPage";

const MyIssues = () => {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();


  useEffect(() => {
    if (!user) return; 
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/issues/my-issues/${user.email}`);
        setIssues(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch issues");
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this issue?")) return;
    try {
      await axiosSecure.delete(`/issues/${id}`);
      setIssues(issues.filter((issue) => issue._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete issue");
    }
  };

  const filteredIssues = issues
    .filter((i) => !statusFilter || i.status === statusFilter)
    .filter((i) => !categoryFilter || i.category === categoryFilter);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Issues</h2>

      {!user && <LoadingPage></LoadingPage>}
      {loading && <LoadingPage></LoadingPage>}

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="In-Progress">In-Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="select select-bordered"
        >
          <option value="">All Categories</option>
          <option value="Broken Streetlight">Broken Streetlight</option>
          <option value="Pothole">Pothole</option>
          <option value="Water Leakage">Water Leakage</option>
          <option value="Garbage Overflow">Garbage Overflow</option>
          <option value="Damaged Footpath">Damaged Footpath</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Issues List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <div key={issue._id} className="p-4 border rounded shadow">
            {issue.image && (
              <img
                src={issue.image}
                alt={issue.title}
                className="w-full h-48 object-cover mb-3 rounded"
              />
            )}
            <h3 className="font-bold text-lg">{issue.title}</h3>
            <p className="text-sm mb-2">{issue.description}</p>
            <p>
              <span className="font-semibold">Status:</span> {issue.status}
            </p>
            <p>
              <span className="font-semibold">Category:</span> {issue.category}
            </p>
            <p>
              <span className="font-semibold">Location:</span> {issue.location}
            </p>

            <div className="mt-4 flex gap-2">
              {issue.status === "Pending" && (
                <button
                  onClick={() => navigate(`/edit-issue/${issue._id}`)}
                  className="btn btn-sm btn-warning"
                >
                  Edit
                </button>
              )}
              {issue.status === "Pending" && (
                <button
                  onClick={() => handleDelete(issue._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              )}
              <Link
                to={`/viewDetails/${issue._id}`}
                className="btn btn-sm btn-primary"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}

        {filteredIssues.length === 0 && !loading && (
          <p className="col-span-full text-center text-gray-500">
            No issues found.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyIssues;
