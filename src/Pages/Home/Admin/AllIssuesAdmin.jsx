import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import Swal from "sweetalert2";

const AllIssuesAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const qc = useQueryClient();
  const [assignIssue, setAssignIssue] = useState(null); // issue object for modal

  const { data = { issues: [] }, isLoading } = useQuery({
    queryKey: ["admin-issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/issues");
      return res.data;
    },
  });

  const assignMutation = useMutation(
    async ({ id, staffEmail, staffName }) =>
      await axiosSecure.post(`/admin/issues/${id}/assign`, {
        staffEmail,
        staffName,
      }),
    {
      onSuccess: () => {
        qc.invalidateQueries(["admin-issues"]);
        qc.invalidateQueries(["admin-stats"]);
      },
    }
  );

  const handleReject = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Reject reason (optional)",
      input: "text",
      showCancelButton: true,
    });
    if (reason !== undefined) {
      try {
        await axiosSecure.post(`/admin/issues/${id}/reject`, { reason });
        Swal.fire("Rejected", "Issue rejected", "success");
        qc.invalidateQueries(["admin-issues"]);
        qc.invalidateQueries(["admin-stats"]);
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || err.message, "error");
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Issues</h2>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.issues.map((issue) => (
            <tr key={issue._id}>
              <td>{issue.title}</td>
              <td>{issue.category}</td>
              <td>{issue.status}</td>
              <td>{issue.priority}</td>
              <td>{issue.assignedTo?.email || "—"}</td>
              <td>
                {!issue.assignedTo && (
                  <button
                    onClick={() => setAssignIssue(issue)}
                    className="btn btn-sm"
                  >
                    Assign
                  </button>
                )}
                {issue.status === "Pending" && (
                  <button
                    onClick={() => handleReject(issue._id)}
                    className="btn btn-sm btn-error ml-2"
                  >
                    Reject
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ASSIGN MODAL (simple) */}
      {assignIssue && (
        <AssignModal
          issue={assignIssue}
          onClose={() => setAssignIssue(null)}
          onAssign={async (staffEmail, staffName) => {
            await assignMutation.mutateAsync({
              id: assignIssue._id,
              staffEmail,
              staffName,
            });
            setAssignIssue(null);
            Swal.fire("Assigned", "Staff assigned successfully", "success");
          }}
        />
      )}
    </div>
  );
};

export default AllIssuesAdmin;
