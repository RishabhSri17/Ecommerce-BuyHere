import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { toast } from 'react-toastify';
import SearchBox from './SearchBox';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { cartItems } = useSelector(state => state.cart);
  const { userInfo } = useSelector(state => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
      toast.success('Logout successful');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="fixed top-0 w-full z-20 bg-[#98CD00] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left section - Brand */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              BuyHere
            </Link>
          </div>

          {/* Middle section - Search (desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
            <SearchBox />
          </div>

          {/* Right section - Navigation (desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/cart" 
              className="flex items-center hover:text-gray-200 transition-colors"
            >
              <FaShoppingCart className="mr-1" />
              Cart
              {cartItems.length > 0 && (
                <span className="ml-1 bg-yellow-400 text-gray-900 rounded-full px-2 py-0.5 text-xs font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center hover:text-gray-200 transition-colors"
                >
                  <span>Hello👋, {userInfo.name}</span>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logoutHandler();
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center hover:text-gray-200 transition-colors"
              >
                <FaUser className="mr-1" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Link 
              to="/cart" 
              className="relative p-2 mr-2 hover:text-gray-200"
            >
              <FaShoppingCart className="text-xl" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:text-gray-200 focus:outline-none"
            >
              {isMenuOpen ? (
                <FaTimes className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#98CD00] px-4 pb-4 shadow-lg">
          <div className="mb-4">
            <SearchBox />
          </div>
          
          <div className="space-y-3">
            {userInfo ? (
              <>
                <div className="px-2 py-1">Hello👋, {userInfo.name}</div>
                <Link
                  to="/profile"
                  onClick={closeMenu}
                  className="block px-2 py-1 hover:bg-[#8abe00] rounded"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    logoutHandler();
                  }}
                  className="block w-full text-left px-2 py-1 hover:bg-[#8abe00] rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center px-2 py-1 hover:bg-[#8abe00] rounded"
              >
                <FaUser className="mr-2" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;