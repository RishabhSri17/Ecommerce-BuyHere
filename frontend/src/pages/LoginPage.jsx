import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import Meta from '../components/Meta';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector(state => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
      toast.success('Login successful');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <Meta title={'Sign In'} />
      <h1 className="text-2xl font-bold mb-6">Sign In</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <div>
          <label htmlFor="email" className="block font-medium mb-1">
            Email address
          </label>
          <input
            type="email"
            id="email"
            className="w-full border rounded px-3 py-2"
            value={email}
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block font-medium mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              className="w-full border rounded px-3 py-2 pr-10"
              value={password}
              placeholder="Enter password"
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
        <div className="flex items-center">
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={e => setRemember(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="remember" className="text-sm">
            Remember me
          </label>
        </div>
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        <div className="text-center">
          New Customer?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>
        </div>
      </form>
    </FormContainer>
  );
};

export default LoginPage;
