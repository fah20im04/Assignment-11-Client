import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../Hooks/useAxiosSecure"; 
import useAuth from "../../Hooks/useAuth"; 
import LoadingPage from "../../Pages/Home/LoadingPage";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "../../Pages/Home/Staff/StarCard";

const StaffDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["staff-dashboard", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/staff/${user.email}`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingPage />;

  const chartData = [
    { name: "Pending", value: data.pending || 0 },
    { name: "In-Progress", value: data.inProgress || 0 },
    { name: "Working", value: data.working || 0 },
    { name: "Resolved", value: data.resolved || 0 },
  ];

  const COLORS = ["#facc15", "#38bdf8", "#fb7185", "#4ade80"];

  return (
    <div className="space-y-8 py-20">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Assigned Issues" value={data.totalAssigned} />
        <StatCard title="Resolved Issues" value={data.resolved} />
        <StatCard title="Today's Tasks" value={data.todayTasks} />
        <StatCard title="Pending Issues" value={data.pending} />
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Issue Status Overview</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StaffDashboard;
