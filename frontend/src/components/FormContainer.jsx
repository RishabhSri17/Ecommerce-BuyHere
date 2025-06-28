import React from 'react';

const FormContainer = ({ children }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;