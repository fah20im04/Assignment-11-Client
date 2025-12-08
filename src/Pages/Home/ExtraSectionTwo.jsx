import React from "react";

const ExtraSectionTwo = () => {
  return (
    <div className="py-16 bg-blue-200 rounded-xl">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Our Community Impact</h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-6">
          Thousands of citizens are actively using the platform to make their
          roads cleaner, safer, and more efficient.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 p-8 ">
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-4xl font-bold text-green-600">1500+</h3>
            <p className="mt-2 text-gray-700 font-bold">Issues Reported</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-4xl font-bold text-green-600">1200+</h3>
            <p className="mt-2 text-gray-700 font-bold">Resolved Successfully</p>
          </div>
          <div className="p-6 bg-white shadow rounded-lg">
            <h3 className="text-4xl font-bold text-green-600">5,000+</h3>
            <p className="mt-2 text-gray-700 font-bold">Active Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtraSectionTwo;
