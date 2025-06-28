import React, { useEffect, useState } from 'react';
import FormContainer from '../../components/FormContainer';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  useUpdateUserMutation,
  useGetUserByIdQuery
} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import Message from '../../components/Message';
import Meta from '../../components/Meta';

const UpdateUserFormPage = () => {
  const { id: userId } = useParams();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const { data: user, isLoading, error } = useGetUserByIdQuery(userId);

  const [updateUser, { isLoading: isUpdateUserLoading }] =
    useUpdateUserMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const submitHandler = async e => {
    e.preventDefault();
    try {
      const userData = { name, email, isAdmin };
      const { data } = await updateUser({ userId, ...userData });
      toast.success(data.message);
      navigate('/admin/userlist');
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <FormContainer>
      <Meta title={'Update User'} />
      <h1 className="text-2xl font-bold mb-6">Update User</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              className="w-full border rounded px-3 py-2"
              value={name}
              placeholder="Enter name"
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">Email address</label>
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
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={e => setIsAdmin(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isAdmin" className="text-sm">Is Admin</label>
          </div>
          <button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded" disabled={isUpdateUserLoading}>
            {isUpdateUserLoading ? 'Updating...' : 'Update'}
          </button>
          <div className="text-center">
            <Link to="/admin/userlist" className="text-blue-600 hover:underline">Back to User List</Link>
          </div>
        </form>
      )}
    </FormContainer>
  );
};

export default UpdateUserFormPage;
