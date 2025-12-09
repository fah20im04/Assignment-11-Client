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

const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/reportIssue",
        element: <ReportIssue></ReportIssue>,
      },
      {
        path: "/all-issues",
        element: <AllIssues></AllIssues>,
      },
      {
        path: "/my-issues",
        element: (
          <PrivateRoute>
            <MyIssues></MyIssues>,
          </PrivateRoute>
        ),
      },
      {
        path: "/viewDetails/:id",
        element: (
          <PrivateRoute>
            <IssueDetails></IssueDetails>
          </PrivateRoute>
        ),
      },
      {
        path: "/boost-payment/:issueId",
        element: (
          <PrivateRoute>
            <BoostPayment></BoostPayment>
          </PrivateRoute>
        ),
      },
      {
        path: "/boost-success",
        element: (
          <PrivateRoute>
            <BoostSuccess />
          </PrivateRoute>
        ),
      },
      {
        path: "/boost-cancel",
        element: (
          <PrivateRoute>
            <BoostCancel></BoostCancel>
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
