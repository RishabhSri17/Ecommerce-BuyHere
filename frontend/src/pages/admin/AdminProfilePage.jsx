import React from 'react';
import ProfileForm from '../../components/ProfileForm';
import Meta from '../../components/Meta';

const AdminProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Meta title={'Admin Profile'} />
        
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Admin Profile
          </h2>
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default AdminProfilePage;