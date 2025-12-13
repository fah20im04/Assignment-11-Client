// DashboardLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import DashboardHome from "./DashboardComponent/DashboardHome";

const DashboardLayout = () => {
  return (
    <div className="flex py-16 min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <main className="p-6 bg-gray-100 flex-1 overflow-auto">
          <Outlet /> {/* renders DashboardHome OR panel routes */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
