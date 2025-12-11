import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/AuthPages/Login";
import Register from "../Pages/AuthPages/Register";
import ReportIssue from "../Pages/Issues/ReportIssue";
import MyIssues from "../Pages/Issues/MyIssues";
import IssueDetails from "../Pages/Issues/IssueDetails";
import PrivateRoute from "./PrivateRoute";
import AllIssues from "../Pages/Issues/AllIssues";
import BoostPayment from "../Pages/Payment/BoostPayment";
import BoostSuccess from "../Pages/Payment/BoostSuccess";
import BoostCancel from "../Pages/Payment/BoostCancel";
import Profile from "../Pages/Home/Profile";
import SubscribeSuccess from "../Pages/Home/Subscribe/SubscribeSuccess";
import SubscribeCancel from "../Pages/Home/Subscribe/SubscribeCancel";

// Dashboard imports
import DashboardLayout from "../Layouts/DashboardLayout"; 
import AdminDashboard from "../Layouts/DashboardComponent/AdminDashboard"; 
import StaffDashboard from "../Layouts/DashboardComponent/StaffDashboard"; 
import CitizenDashboard from "../Layouts/DashboardComponent/CitizenDashboard"; 
import RoleRoute from "./RoleRoute";
import BeAStaff from "../Pages/Home/Staff/BeAStaff";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "/reportIssue",
        element: (
          <PrivateRoute>
            <ReportIssue />
          </PrivateRoute>
        ),
      },
      { path: "/all-issues", element: <AllIssues /> },
      {
        path: "/my-issues",
        element: (
          <PrivateRoute>
            <MyIssues />
          </PrivateRoute>
        ),
      },
      {
        path: "/be_a_staff",
        element: (
          <PrivateRoute>
            <BeAStaff />
          </PrivateRoute>
        ),
      },
      {
        path: "/viewDetails/:id",
        element: (
          <PrivateRoute>
            <IssueDetails />
          </PrivateRoute>
        ),
      },
      {
        path: "/boost-payment/:issueId",
        element: (
          <PrivateRoute>
            <BoostPayment />
          </PrivateRoute>
        ),
      },
      { path: "/boost-success", element: <BoostSuccess /> },
      { path: "/boost-cancel", element: <BoostCancel /> },
      { path: "/subscribe-success", element: <SubscribeSuccess /> },
      { path: "/subscribe-cancel", element: <SubscribeCancel /> },

      // -------------------------
      // Dashboard Routes
      // -------------------------
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <RoleRoute role="admin">
                <AdminDashboard />
              </RoleRoute>
            ),
          },
          {
            path: "staff",
            element: (
              <RoleRoute role="staff">
                <StaffDashboard />
              </RoleRoute>
            ),
          },
          {
            path: "citizen",
            element: (
              <RoleRoute role="citizen">
                <CitizenDashboard />
              </RoleRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
