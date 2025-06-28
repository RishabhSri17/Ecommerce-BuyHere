import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useResetPasswordMutation } from '../slices/usersApiSlice';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';
import { useParams } from 'react-router-dom';
import Message from '../components/Message';

const ResetPasswordPage = () => {
  const { id: userId, token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setConfirmShowPassword(!showConfirmPassword);
  };

  const submitHandler = async e => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }
      const res = await resetPassword({ userId, token, password }).unwrap();
      setPassword('');
      setConfirmPassword('');
      setMessage(res.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <Meta title={'Reset Password'} />
      <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
      {message && <Message>{message}</Message>}
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label htmlFor="password" className="block font-medium mb-1">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full border rounded px-3 py-2 pr-10"
              value={password}
              placeholder="Enter new password"
              onChange={e => setPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block font-medium mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              className="w-full border rounded px-3 py-2 pr-10"
              value={confirmPassword}
              placeholder="Confirm new password"
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded" disabled={isLoading}>
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </FormContainer>
  );
};

export default ResetPasswordPage;
