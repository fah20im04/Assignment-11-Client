import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import LoadingPage from "../Home/LoadingPage";

const BoostSuccess = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const axiosSecure = useAxiosSecure();
  const [status, setStatus] = useState("loading");
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const res = await axiosSecure.get(
          `/boost-success?session_id=${sessionId}`
        );
        setDetails(res.data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId]);

  if (status === "loading") {
    return <LoadingPage></LoadingPage>
  }

  if (status === "error") {
    return (
      <div className="text-center py-22 text-red-500">
        <h2 className="text-2xl font-semibold">Verification Failed</h2>
        <p>Please contact support.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-22 text-center bg-base-200 rounded-xl">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <p className="mt-4">Your issue has been boosted successfully.</p>

      <div className="mt-4 p-4 bg-white rounded-lg shadow">
        <p>
          <strong>Issue ID:</strong> {details.issueId}
        </p>
        <p>
          <strong>Email:</strong> {details.email}
        </p>
        <p>
          <strong>Status:</strong> {details.status}
        </p>
      </div>

      <a href="/dashboard" className="btn btn-primary mt-6">
        Go to Dashboard
      </a>
    </div>
  );
};

export default BoostSuccess;
