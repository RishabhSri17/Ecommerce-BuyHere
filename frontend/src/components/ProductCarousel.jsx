import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGetTopProductsQuery } from "../slices/productsApiSlice";
import { addCurrency } from "../utils/addCurrency";
import SpinningCubeLoader from "./SpinningCubeLoader";
import AlertMessage from "./AlertMessage";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ProductCarousel = () => {
	const { data: response, isLoading, error } = useGetTopProductsQuery();
	const [currentIndex, setCurrentIndex] = useState(0);
	const backendUrl = import.meta.env.VITE_BACKEND_URL;

	// Extract products array from response
	const products = response?.products || [];

	// Auto-advance slides every 3 seconds
	useEffect(() => {
		if (products && products.length > 1) {
			const interval = setInterval(() => {
				setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
			}, 3000);
			return () => clearInterval(interval);
		}
	}, [products]);

	const getImageUrl = (image) => {
		if (!image) return "";
		if (image.startsWith("/uploads/")) {
			return `${backendUrl}${image}`;
		}
		return image;
	};

	const nextSlide = () => {
		setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
	};

	const prevSlide = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? products.length - 1 : prevIndex - 1
		);
	};

	if (isLoading) return <SpinningCubeLoader />;
	if (error)
		return (
			<AlertMessage variant="danger">
				{error?.data?.message || error.error}
			</AlertMessage>
		);

	// Safety check for products array
	if (!products || !Array.isArray(products) || products.length === 0) {
		return (
			<div className="w-full h-[500px] bg-gray-100 rounded-xl mb-8 shadow-lg flex items-center justify-center">
				<p className="text-gray-500 text-lg">No products available</p>
			</div>
		);
	}

	return (
		<div className="relative w-full overflow-hidden h-[500px] bg-gray-100 rounded-xl mb-8 shadow-lg">
			{products.map((product, index) => (
				<div
					key={product._id}
					className={`absolute inset-0 transition-opacity duration-700 ${
						index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
					}`}
				>
					<Link
						to={`/product/${product._id}`}
						className="block h-full"
					>
						<div className="h-full flex items-center justify-center bg-gray-50">
							<img
								src={getImageUrl(product.image)}
								alt={product.name}
								className="h-full w-full object-contain p-4"
							/>
						</div>

						{/* Updated Carousel Caption */}
						<div className="absolute bottom-0 left-0 right-0 w-full bg-black/50 p-6 text-center">
							<h3 className="text-2xl font-bold text-white mb-1">
								{product.name}
							</h3>
							<p className="text-xl font-semibold text-amber-400">
								{addCurrency(product.price)}
							</p>
						</div>
					</Link>
				</div>
			))}

			{/* Navigation Arrows */}
			{products.length > 1 && (
				<>
					<button
						onClick={prevSlide}
						className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
						aria-label="Previous slide"
					>
						<FaChevronLeft className="w-5 h-5" />
					</button>
					<button
						onClick={nextSlide}
						className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all"
						aria-label="Next slide"
					>
						<FaChevronRight className="w-5 h-5" />
					</button>
				</>
			)}

			{/* Pagination Dots */}
			{products.length > 1 && (
				<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
					{products.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-3 h-3 rounded-full transition-all ${
								index === currentIndex
									? "bg-amber-500"
									: "bg-white/50 hover:bg-white"
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default ProductCarousel;
