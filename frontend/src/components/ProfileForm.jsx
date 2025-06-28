import React, { useState } from 'react';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { useProfileMutation } from '../slices/usersApiSlice';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Loader from './Loader';

const ProfileForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const { userInfo } = useSelector(state => state.auth);
  const [updateProfile, { isLoading: isUpdateProfileLoading }] = useProfileMutation();
  const dispatch = useDispatch();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setConfirmShowPassword(!showConfirmPassword);

  const submitHandler = async e => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        return toast.error('Passwords do not match!');
      }
      const res = await updateProfile({ name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      toast.success(res.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      <div className="space-y-4">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            placeholder="Enter name"
            onChange={e => setName(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="Enter password"
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              placeholder="Confirm password"
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors pr-12"
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? <FaEyeSlash className="w-5 h-5" /> : <FaEye className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <button
        type="submit"
        disabled={isUpdateProfileLoading}
        className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-amber-300 disabled:cursor-not-allowed"
      >
        Update Profile
      </button>

      {/* Loader */}
      {isUpdateProfileLoading && (
        <div className="flex justify-center mt-4">
          <Loader />
        </div>
      )}
    </form>
  );
};

export default ProfileForm;