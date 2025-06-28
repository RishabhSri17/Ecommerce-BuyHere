import React, { useState } from 'react';
import { useNewPasswordRequestMutation } from '../slices/usersApiSlice';
import FormContainer from '../components/FormContainer';
import Meta from '../components/Meta';
import Message from '../components/Message';
import { toast } from 'react-toastify';

const ResetPasswordRequestPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [requestNewPassword, { isLoading }] = useNewPasswordRequestMutation();
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await requestNewPassword({ email }).unwrap();
      setMessage(res.message);
      setEmail('');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <Meta title={'Request New Password'} />
      <h1 className="text-2xl font-bold mb-6">Request New Password</h1>
      {message && <Message>{message}</Message>}
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Requesting...' : 'Request Password Reset'}
        </button>
      </form>
    </FormContainer>
  );
};

export default ResetPasswordRequestPage;
