import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../Hooks/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { Navigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const CARD_CLASSES = "bg-white shadow-md rounded-lg p-6 text-center";

const CitizenDashboard = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch dashboard stats
  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["citizen-dashboard", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/citizen/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (!user) return <Navigate to="/login" />;

  if (user?.blocked) {
    return (
      <div className="p-10 text-center text-red-600">
        <h2 className="text-3xl font-bold mb-4">Account Blocked</h2>
        <p>
          Your account has been blocked by admin. Please contact the authorities
          for assistance.
        </p>
      </div>
    );
  }

  if (isLoading) return <p className="p-10 text-center">Loading...</p>;

  const chartData = [
    { name: "Pending", value: stats.pending || 0 },
    { name: "In Progress", value: stats.inProgress || 0 },
    { name: "Resolved", value: stats.resolved || 0 },
  ];

  const COLORS = ["#FBBF24", "#3B82F6", "#10B981"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-primary">Citizen Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={CARD_CLASSES}>
          <h3 className="text-gray-500">Total Issues Submitted</h3>
          <p className="text-2xl font-bold">{stats.totalIssues || 0}</p>
        </div>
        <div className={CARD_CLASSES}>
          <h3 className="text-gray-500">Pending Issues</h3>
          <p className="text-2xl font-bold">{stats.pending || 0}</p>
        </div>
        <div className={CARD_CLASSES}>
          <h3 className="text-gray-500">In Progress</h3>
          <p className="text-2xl font-bold">{stats.inProgress || 0}</p>
        </div>
        <div className={CARD_CLASSES}>
          <h3 className="text-gray-500">Resolved Issues</h3>
          <p className="text-2xl font-bold">{stats.resolved || 0}</p>
        </div>
        <div className={CARD_CLASSES}>
          <h3 className="text-gray-500">Total Payments</h3>
          <p className="text-2xl font-bold">{stats.totalPayments || 0} tk</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-6 text-center">
          Issue Status Distribution
        </h2>
        <PieChart width={450} height={350}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120} // slightly bigger
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </div>
    </div>
  );
};

export default CitizenDashboard;
