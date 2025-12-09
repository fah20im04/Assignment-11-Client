import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useAuth from "../../Hooks/useAuth";

const BoostPayment = () => {
  const { issueId } = useParams(); // or whatever param you pass
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch issue data
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await axiosSecure.get(`/issues/${issueId}`);
        setIssue(res.data);
      } catch (err) {
        console.error("Failed to fetch issue:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [issueId]);

  const handleBoost = async () => {
    try {
      const res = await axiosSecure.post("/create-boost-session", {
        issueId: issue._id,
        cost: 100,
        title: issue.title,
        userEmail: user.email,
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Boost payment failed:", err);
    }
  };

  if (loading)
    return <span className="loading loading-infinity loading-xl"></span>;
  if (!issue) return <p className="text-red-500">Issue not found</p>;

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">
        Pay 100tk to boost: {issue.title}
      </h2>
      <button onClick={handleBoost} className="btn btn-primary text-black">
        Pay & Boost Priority
      </button>
    </div>
  );
};

export default BoostPayment;
