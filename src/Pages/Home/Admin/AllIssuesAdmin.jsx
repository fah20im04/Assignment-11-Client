import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useRole from "../../../Hooks/useRole"; 
import LoadingPage from "../../Home/LoadingPage";
import Swal from "sweetalert2";
import { AssignModal } from "../Modal/AssignModal";

const AllIssuesAdmin = () => {
  const axiosSecure = useAxiosSecure();
  const [assignIssue, setAssignIssue] = useState(null); // issue object for modal
  const { role, roleLoading } = useRole();

  // Show loading while role is fetched
  if (roleLoading) return <LoadingPage />;

  // Only admin can access
  // if (role !== "admin") {
  //   return ;

  // Fetch all issues
  const {
    data = { issues: [] },
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["admin-issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/issues");
      return res.data;
    },
  });

  // Assign staff mutation
  const assignMutation = useMutation({
    mutationFn: async ({ id, staffEmail, staffName }) => {
      return axiosSecure.post(`/admin/issues/${id}/assign`, {
        staffEmail,
        staffName,
      });
    },
    onSuccess: () => {
      refetch();
      Swal.fire("Assigned", "Staff assigned successfully", "success");
    },
    onError: (err) => {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    },
  });

  // Reject issue
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
        refetch();
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || err.message, "error");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Issues</h2>

      <div className="overflow-x-auto shadow rounded-lg">
        <table className="table-auto w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">Title</th>
              <th className="px-4 py-2 border">Category</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Priority</th>
              <th className="px-4 py-2 border">Assigned Staff</th>
              <th className="px-4 py-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.issues.map((issue) => (
              <tr key={issue._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{issue.title}</td>
                <td className="px-4 py-2 border">{issue.category}</td>
                <td className="px-4 py-2 border">{issue.status}</td>
                <td className="px-4 py-2 border">{issue.priority}</td>
                <td className="px-4 py-2 border">
                  {issue.assignedTo?.email || "—"}
                </td>
                <td className="px-4 py-2 border flex gap-2">
                  {!issue.assignedTo && (
                    <button
                      onClick={() => setAssignIssue(issue)}
                      className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Assign
                    </button>
                  )}
                  {issue.status === "Pending" && (
                    <button
                      onClick={() => handleReject(issue._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ASSIGN MODAL */}
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
          }}
        />
      )}
    </div>
  );
};


export default AllIssuesAdmin;
