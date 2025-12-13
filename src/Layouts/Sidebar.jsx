// Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import useRole from "../Hooks/useRole";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // arrow icons
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { MdOutlineDashboard, MdSpaceDashboard } from "react-icons/md";

const Sidebar = () => {
  const { role, roleLoading } = useRole();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative left-1 bg-green-200">
      {/* Sidebar */}
      <aside
        className={`bg-green-200 shadow-md p-4 flex flex-col gap-4 transition-all duration-300 
        ${isOpen ? "w-64" : "w-0 overflow-hidden"}`}
      >
        {isOpen && (
          <>
            <h1 className="text-2xl font-bold mb-2">Dashboard</h1>

            {/* Common Links */}
            <NavLink
              to="/dashboard"
              className="hover:bg-green-300 font-bold p-2 rounded"
            >
              Overview
            </NavLink>

            <NavLink
              to="/my-issues"
              className="hover:bg-green-300 p-2 font-bold rounded"
            >
              My Issues
            </NavLink>

            <NavLink
              to="/reportIssue"
              className="hover:bg-green-300 p-2 font-bold rounded"
            >
              Report Issue
            </NavLink>

            {/* ADMIN-ONLY SECTION */}
            {role === "admin" && (
              <div className="mt-4 border-t pt-3">
                <h2 className="text-lg font-semibold text-gray-700 mb-1">
                  Admin Panel
                </h2>

                <NavLink
                  to="/dashboard/allIssuesAdmin"
                  className="hover:bg-green-300 p-2 font-bold rounded block"
                >
                  Issue Management
                </NavLink>

                <NavLink
                  to="/dashboard/manage_staff"
                  className="hover:bg-green-300 p-2 font-bold rounded block"
                >
                  Staff Management
                </NavLink>

                <NavLink
                  to="/dashboard/payments"
                  className="hover:bg-green-300 p-2 font-bold rounded block"
                >
                  Payment Logs
                </NavLink>
              </div>
            )}
            {role === "staff" && (
              <div className="mt-4 border-t pt-3">
                <h2 className="text-lg font-bold text-black mb-1">
                  Staff Panel
                </h2>

                <NavLink
                  to="/dashboard/staffAssignedIssue"
                  className="hover:bg-green-300 p-2 font-bold rounded block"
                >
                  Issue Management
                </NavLink>

                {/* <NavLink
                  to="/dashboard/manage-users"
                  className="hover:bg-gray-200 p-2 font-bold rounded block"
                >
                  User Management
                </NavLink> */}

                <NavLink
                  to="/dashboard/payments"
                  className="hover:bg-green-300 p-2 font-bold rounded block"
                >
                  Payment Logs
                </NavLink>
              </div>
            )}
          </>
        )}
      </aside>

      {/* Toggle Arrow (always visible) */}
      <button
        onClick={toggleSidebar}
        title="Dashboard"
        className="absolute top-2 right-1 p-2 bg-green-200 rounded-full transition"
      >
        {isOpen ? (
          <MdSpaceDashboard size={24} />
        ) : (
          <MdOutlineDashboard size={24} />
        )}
      </button>
    </div>
  );
};

export default Sidebar;
