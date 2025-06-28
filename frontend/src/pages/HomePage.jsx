import React, { useEffect, useState } from 'react';

import { useGetProductsQuery } from '../slices/productsApiSlice';
import { useSelector } from 'react-redux';
import Product from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import ServerError from '../components/ServerError';
import Meta from '../components/Meta';

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(0);
  const [skip, setSkip] = useState(0);
  const { search } = useSelector(state => state.search);

  const { data, isLoading, error } = useGetProductsQuery({
    limit,
    skip,
    search
  });

  useEffect(() => {
    if (data) {
      setLimit(4);
      setSkip((currentPage - 1) * limit);
      setTotal(data.total);
      setTotalPage(Math.ceil(total / limit));
    }
  }, [currentPage, data, limit, total, search]);

  const pageHandler = pageNum => {
    if (pageNum >= 1 && pageNum <= totalPage && pageNum !== currentPage) {
      setCurrentPage(pageNum);
    }
  };

  return (
    <>
      <Meta />
      <ProductCarousel />
      <h1 className="text-3xl font-bold mb-6 mt-4 text-center">Latest Products</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ServerError error={error} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.products.map(product => (
            <Product key={product._id} product={product} />
          ))}
        </div>
      )}
      <div className="flex justify-center mt-8">
        <Paginate
          currentPage={currentPage}
          totalPage={totalPage}
          pageHandler={pageHandler}
        />
      </div>
    </>
  );
};

export default HomePage;
