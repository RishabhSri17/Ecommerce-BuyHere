import React, { useEffect, useState } from "react";

import { useGetProductsQuery } from "../slices/productsApiSlice";
import { useSelector } from "react-redux";
import Product from "../components/Product";
import SpinningCubeLoader from "../components/SpinningCubeLoader";
import AlertMessage from "../components/AlertMessage";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import ServerError from "../components/ServerError";
import Meta from "../components/Meta";

const HomePage = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPage, setTotalPage] = useState(0);
	const [total, setTotal] = useState(0);
	const [limit, setLimit] = useState(0);
	const [skip, setSkip] = useState(0);
	const { search } = useSelector((state) => state.search);

	const { data, isLoading, error } = useGetProductsQuery({
		limit,
		skip,
		search
	});

	useEffect(() => {
		if (data) {
			setLimit(4);
			setSkip((currentPage - 1) * 4);
			setTotal(data.pagination?.total || 0);
			setTotalPage(Math.ceil((data.pagination?.total || 0) / 4));
		}
	}, [currentPage, data, search]);

	const pageHandler = (pageNum) => {
		if (pageNum >= 1 && pageNum <= totalPage && pageNum !== currentPage) {
			setCurrentPage(pageNum);
		}
	};

	return (
		<>
			<Meta />
			<ProductCarousel />
			<h1 className="text-3xl font-bold mb-6 mt-4 text-center">
				Latest Products
			</h1>
			{isLoading ? (
				<SpinningCubeLoader />
			) : error ? (
				<ServerError error={error} />
			) : data?.products && data.products.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{data.products.map((product) => (
						<Product
							key={product._id}
							product={product}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-8">
					<p className="text-gray-500 text-lg">No products found</p>
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
