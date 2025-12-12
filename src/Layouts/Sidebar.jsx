// Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import useRole from "../Hooks/useRole";
import LoadingPage from "../Pages/Home/LoadingPage";

const Sidebar = () => {
  const { role, roleLoading } = useRole();



  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>

      {/* Common Links */}
      <NavLink
        to="/dashboard"
        className="hover:bg-gray-200 font-bold p-2 rounded"
      >
        Overview
      </NavLink>

      <NavLink
        to="/dashboard/my-issues"
        className="hover:bg-gray-200 p-2 font-bold rounded"
      >
        My Issues
      </NavLink>

      <NavLink
        to="/dashboard/reportIssue"
        className="hover:bg-gray-200 p-2 font-bold rounded"
      >
        Report Issue
      </NavLink>

      {/*  ADMIN-ONLY SECTION */}
      {role === "admin" && (
        <div className="mt-4 border-t pt-3">
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            Admin Panel
          </h2>

          <NavLink
            to="/dashboard/allIssuesAdmin"
            className="hover:bg-gray-200 p-2 font-bold rounded block"
          >
            Issue Management
          </NavLink>

          <NavLink
            to="/dashboard/manage-users"
            className="hover:bg-gray-200 p-2 font-bold rounded block"
          >
            User Management
          </NavLink>

          <NavLink
            to="/dashboard/payments"
            className="hover:bg-gray-200 p-2 font-bold rounded block"
          >
            Payment Logs
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
