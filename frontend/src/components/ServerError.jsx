import React from 'react';

const ServerError = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-16 w-16 text-red-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-7xl font-bold text-gray-800 mb-2">500</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Internal Server Error</h2>
          
          <p className="text-gray-600 mb-2">
            <span className="text-red-500 font-medium">Oops!</span> Something went wrong on our end.
          </p>
          <p className="text-gray-500 mb-6">
            Our team has been notified. Please try again later.
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reload Page
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
            >
              Go Back
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 py-4 px-6 text-center text-sm text-gray-500">
          Need immediate help? <a href="/contact" className="text-blue-600 hover:text-blue-800">Contact support</a>
        </div>
      </div>
    </div>
  );
};

export default ServerError;