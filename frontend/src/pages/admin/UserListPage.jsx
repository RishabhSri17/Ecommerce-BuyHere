import React from 'react';
import { FaCheck, FaTrash, FaXmark } from 'react-icons/fa6';
import { FaEdit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  useGetUsersQuery,
  useDeleteUserMutation
} from '../../slices/usersApiSlice';
import SpinningCubeLoader from '../../components/SpinningCubeLoader';
import { toast } from 'react-toastify';
import AlertMessage from '../../components/AlertMessage';
import Meta from '../../components/Meta';

const UserListPage = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();
  const [deleteUser, { isLoading: isDeleteUserLoading }] = useDeleteUserMutation();

  const deleteHandler = async userId => {
    try {
      const { data } = await deleteUser(userId);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Meta title={'User List'} />
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      {isDeleteUserLoading && <SpinningCubeLoader />}
      {isLoading ? (
        <SpinningCubeLoader />
      ) : error ? (
        <AlertMessage variant='danger'>
          {error?.data?.message || error.error}
        </AlertMessage>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">NAME</th>
                <th className="px-4 py-2">EMAIL</th>
                <th className="px-4 py-2">ADMIN</th>
                <th className="px-4 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="text-center border-t">
                  <td className="px-4 py-2">{user._id}</td>
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">
                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">{user.email}</a>
                  </td>
                  <td className="px-4 py-2">
                    {user.isAdmin ? (
                      <FaCheck className="text-green-600 mx-auto" />
                    ) : (
                      <FaXmark className="text-red-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <Link
                      to={`/admin/user/${user._id}/edit`}
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => deleteHandler(user._id)}
                      className="inline-block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default UserListPage;
