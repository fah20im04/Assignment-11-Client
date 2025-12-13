import React, { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";

const StaffAssignedIssue = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    const fetchIssues = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/staff/issues/${user.email}`);
        setIssues(res.data);
      } catch (err) {
        console.error("Error fetching assigned issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [user?.email, axiosSecure]);

  // Handle status updates
  const updateStatus = async (id, action) => {
    try {
      let status, message;

      switch (action) {
        case "Accept":
          status = "In-Progress";
          message = `Issue accepted by Staff: ${user.email}`;
          break;
        case "Start":
          status = "Working";
          message = `Staff started working on the issue`;
          break;
        case "Resolve":
          status = "Resolved";
          message = `Issue resolved by Staff: ${user.email}`;
          break;
        case "Reject":
          status = "Rejected";
          message = `Staff rejected the issue`;
          break;
        default:
          return;
      }

      const res = await axiosSecure.patch(`/staff/issues/${id}/status`, {
        status,
        message,
      });

      setIssues((prev) =>
        prev.map((issue) => (issue._id === id ? res.data : issue))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Assigned Issues</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-4">
                No assigned issues
              </td>
            </tr>
          )}
          {issues.map((issue) => (
            <tr key={issue._id}>
              <td className="border px-2 py-1">{issue.title}</td>
              <td className="border px-2 py-1">{issue.status}</td>
              <td className="border px-2 py-1 space-x-2">
                {issue.status === "Pending" && (
                  <>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => updateStatus(issue._id, "Accept")}
                    >
                      Accept
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => updateStatus(issue._id, "Reject")}
                    >
                      Reject
                    </button>
                  </>
                )}
                {issue.status === "In-Progress" && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => updateStatus(issue._id, "Start")}
                  >
                    Start Work
                  </button>
                )}
                {issue.status === "Working" && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => updateStatus(issue._id, "Resolve")}
                  >
                    Resolve
                  </button>
                )}
                {issue.status === "Rejected" && <span>Rejected</span>}
                {issue.status === "Resolved" && <span>Resolved</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffAssignedIssue;
