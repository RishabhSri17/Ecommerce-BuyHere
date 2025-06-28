import React from 'react';

const DashboardCard = ({ title, icon, value, bgColor }) => {
  return (
    <div 
      className={`mb-3 p-4 rounded-lg text-white shadow-md ${bgColor}`}
    >
      <div className="flex items-center">
        <div className="w-1/3 flex justify-center">
          {React.cloneElement(icon, { className: "text-3xl" })}
        </div>
        <div className="w-2/3">
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;