import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full py-6 bg-gray-50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-gray-600">
            MERN Shop &copy; {currentYear}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;