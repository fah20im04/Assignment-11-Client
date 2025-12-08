import React from "react";
import { Upload, Search, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      title: "1. Report an Issue",
      desc: "Submit issue details with photos and location.",
      icon: <Upload size={40} className="text-blue-600" />,
    },
    {
      title: "2. Admin Reviews",
      desc: "Admin verifies, assigns staff, and updates the status.",
      icon: <Search size={40} className="text-yellow-600" />,
    },
    {
      title: "3. Issue Resolved",
      desc: "Users get updated when the issue is fixed.",
      icon: <CheckCircle size={40} className="text-green-600" />,
    },
  ];

  return (
    <div className="py-16 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">How it Works</h2>

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12">
        {steps.map((step, i) => (
          <div key={i} className="text-center p-6">
            <div className="flex justify-center mb-4">{step.icon}</div>
            <h3 className="text-xl font-semibold">{step.title}</h3>
            <p className="text-gray-600 mt-2 font-semibold">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowItWorks;
