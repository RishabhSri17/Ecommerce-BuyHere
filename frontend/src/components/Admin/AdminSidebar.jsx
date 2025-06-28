import React from 'react';
import {
  FaCartShopping,
  FaCircleUser,
  FaGauge,
  FaPowerOff,
  FaTable,
  FaUserGroup,
  FaUsers
} from 'react-icons/fa6';
import { useLogoutMutation } from '../../slices/usersApiSlice';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { logout } from '../../slices/authSlice';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/admin/login');
      toast.success('Logout successful');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const navItems = [
    { 
      path: '/admin/dashboard', 
      icon: <FaGauge className="mr-3" size={16} />, 
      label: 'Dashboard' 
    },
    { 
      path: '/admin/product-list', 
      icon: <FaTable className="mr-3" size={16} />, 
      label: 'Products' 
    },
    { 
      path: '/admin/order-list', 
      icon: <FaCartShopping className="mr-3" size={16} />, 
      label: 'Orders' 
    },
    { 
      path: '/admin/user-list', 
      icon: <FaUsers className="mr-3" size={16} />, 
      label: 'Users' 
    },
    { 
      path: '/admin/admin-list', 
      icon: <FaUserGroup className="mr-3" size={16} />, 
      label: 'Admins' 
    },
    { 
      path: '/admin/profile', 
      icon: <FaCircleUser className="mr-3" size={16} />, 
      label: 'Profile' 
    }
  ];

  return (
    <div className="flex flex-col space-y-2 p-4">
      {navItems.map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="flex items-center py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 font-semibold"
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      ))}
      
      <button
        onClick={logoutHandler}
        className="flex items-center w-full py-2 px-4 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 font-semibold text-left"
      >
        <FaPowerOff className="mr-3" size={16} />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;