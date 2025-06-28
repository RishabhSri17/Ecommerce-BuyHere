import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from './AdminSidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const AdminHeader = () => {
  const { userInfo } = useSelector(state => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 w-full z-20 bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Brand */}
          <div className="flex items-center">
            <Link 
              to="/admin/dashboard" 
              className="text-xl font-bold"
            >
              MERN Shop Admin
            </Link>
          </div>

          {/* Desktop greeting */}
          <div className="hidden md:block ml-auto mr-4">
            <span className="text-gray-300">Hello,👋{userInfo?.name}</span>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-700 px-4 pt-2 pb-4">
          <div className="py-2 border-b border-gray-600">
            <span className="text-gray-300">Hello,👋{userInfo?.name}</span>
          </div>
          <div className="mt-2">
            <AdminSidebar />
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminHeader;