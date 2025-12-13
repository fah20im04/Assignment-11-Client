import React from 'react';

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h4 className="text-sm text-gray-500">{title}</h4>
      <p className="text-3xl font-bold mt-2">{value ?? 0}</p>
    </div>
  );
};

export default StatCard;


