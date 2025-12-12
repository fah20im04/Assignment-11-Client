import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Link } from "react-router";

const statusColor = (status) => {
  switch (status) {
    case "Pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "Resolved":
      return "bg-green-100 text-green-700 border-green-300";
    case "Rejected":
      return "bg-red-100 text-red-700 border-red-300";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/stats");
      return res.data;
    },
  });



  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <Link to='/dashboard/allIssuesAdmin' className="text-white h-[100px] rounded-xl text-3xl font-bold  btn btn-primary">
        Issuse Management
      </Link>

      {/* MAIN STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { title: "Total Issues", value: stats.totalIssues },
          { title: "Resolved Issues", value: stats.resolved },
          { title: "Pending Issues", value: stats.pending },
          { title: "Rejected Issues", value: stats.rejected },
          { title: "Total Payments", value: stats.totalPayments + " tk" },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-5 border hover:shadow-lg transition-all"
          >
            <h2 className="text-gray-600 font-medium">{item.title}</h2>
            <p className="text-3xl font-bold mt-2">{item.value}</p>
          </div>
        ))}
      </div>

      {/* 3 COLUMN TABLE SECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LATEST ISSUES TABLE */}
        <div className="bg-white shadow-lg rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Latest Issues
          </h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Title</th>
                <th className="py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestIssues?.map((i) => (
                <tr
                  key={i._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 font-medium">{i.title}</td>
                  <td className="py-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full border ${statusColor(
                        i.status
                      )}`}
                    >
                      {i.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LATEST PAYMENTS TABLE */}
        <div className="bg-white shadow-lg rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Latest Payments</h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">User</th>
                <th className="py-2 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestPayments?.map((p) => (
                <tr
                  key={p._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2">{p.email}</td>
                  <td className="py-2 font-semibold">{p.amount} tk</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* LATEST USERS TABLE */}
        <div className="bg-white shadow-lg rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Latest Users</h3>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Name</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestUsers?.map((u) => (
                <tr
                  key={u.email}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-2 font-medium">
                    {u.displayName || u.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
