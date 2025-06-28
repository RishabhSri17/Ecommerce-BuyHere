import React from 'react';
import Meta from '../components/Meta';

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Meta title={'404 Not Found'} />
      <div className="text-center bg-white p-8 rounded shadow-md">
        <h1 className="text-7xl font-extrabold text-yellow-500 mb-4">404</h1>
        <p className="text-2xl mb-2">
          <span className="text-red-500 font-bold">Oops!</span> Page not found.
        </p>
        <p className="text-lg mb-6">The page you’re looking for doesn’t exist.</p>
        <a href="/" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-2 rounded transition">Go Home</a>
      </div>
    </div>
  );
};

export default NotFoundPage;
