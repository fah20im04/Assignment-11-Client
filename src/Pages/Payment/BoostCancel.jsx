import React from "react";
import { Link } from "react-router-dom";

const BoostCancel = () => {
  return (
    <div className="max-w-full mx-auto py-22 text-center bg-base-200  rounded-xl">
      <h1 className="text-3xl font-bold text-red-500">Payment Cancelled </h1>
      <p className="mt-3">Your boost payment was not completed.</p>
      <p>Please try again whenever you're ready.</p>

      <Link to="/issues" className="btn btn-primary mt-6">
        Go Back
      </Link>
    </div>
  );
};

export default BoostCancel;
