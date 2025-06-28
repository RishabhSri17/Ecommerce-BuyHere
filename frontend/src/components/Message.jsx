import React from 'react';

const Message = ({ variant = 'info', children }) => {
  const variantClasses = {
    primary: "bg-blue-100 text-blue-800 border border-blue-300",
    secondary: "bg-gray-100 text-gray-800 border border-gray-300",
    success: "bg-green-100 text-green-800 border border-green-300",
    danger: "bg-red-100 text-red-800 border border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    info: "bg-blue-100 text-blue-800 border border-blue-300",
    light: "bg-gray-200 text-gray-800 border border-gray-300",
    dark: "bg-gray-800 text-gray-100 border border-gray-900"
  };

  return (
    <div className={`rounded-md p-4 mb-4 ${variantClasses[variant] || variantClasses.info}`}>
      {children}
    </div>
  );
};

export default Message;