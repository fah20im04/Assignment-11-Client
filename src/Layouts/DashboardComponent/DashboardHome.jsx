import React from "react";
import useRole from "../../Hooks/useRole";
import LoadingPage from "../../Pages/Home/LoadingPage";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";
import CitizenDashboard from "./CitizenDashboard";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();
  console.log('dashboard role',role);

  if (roleLoading) return <LoadingPage />;

  const userRole = role || "citizen";
  if (userRole === "admin") return <AdminDashboard />;
  else if (userRole === "staff") return <StaffDashboard />;
  else return <CitizenDashboard />;
};

export default DashboardHome;
