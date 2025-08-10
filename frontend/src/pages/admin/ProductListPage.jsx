import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaRupeeSign, FaTrash, FaEdit } from 'react-icons/fa';
import { useGetProductsQuery, useDeleteProductMutation } from '../../slices/productsApiSlice';
import SpinningCubeLoader from '../../components/SpinningCubeLoader';
import Paginate from '../../components/Paginate';
import AlertMessage from '../../components/AlertMessage';
import Meta from '../../components/Meta';
import { addCurrency } from '../../utils/addCurrency';

const ProductListPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(0);
  const [skip, setSkip] = useState(0);

  const { data, isLoading, error } = useGetProductsQuery({
    limit,
    skip
  });

  const [deleteProduct, { isLoading: isDeleteProductLoading }] = useDeleteProductMutation();

  useEffect(() => {
    if (data) {
      setLimit(8);
      setSkip((currentPage - 1) * limit);
      setTotal(data.total);
      setTotalPage(Math.ceil(data.total / 8));
    }
  }, [currentPage, data]);

  const deleteHandler = async productId => {
    try {
      const { data } = await deleteProduct(productId);
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Meta title={'Product List'} />
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      {isDeleteProductLoading && <SpinningCubeLoader />}
      {isLoading ? (
        <SpinningCubeLoader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">NAME</th>
                <th className="px-4 py-2">PRICE</th>
                <th className="px-4 py-2">CATEGORY</th>
                <th className="px-4 py-2">BRAND</th>
                <th className="px-4 py-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map(product => (
                <tr key={product._id} className="text-center border-t">
                  <td className="px-4 py-2">{product._id}</td>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{addCurrency(product.price)}</td>
                  <td className="px-4 py-2">{product.category}</td>
                  <td className="px-4 py-2">{product.brand}</td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => deleteHandler(product._id)}
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
      <div className="flex justify-center mt-8">
        <Paginate
          currentPage={currentPage}
          totalPage={totalPage}
          pageHandler={setCurrentPage}
        />
      </div>
    </>
  );
};

export default ProductListPage;
