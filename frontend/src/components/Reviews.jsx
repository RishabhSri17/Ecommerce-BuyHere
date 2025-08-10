import React from "react";
import AlertMessage from "./AlertMessage";
import { Link } from "react-router-dom";
import Rating from "./Rating";

const Reviews = ({
	product,
	userInfo,
	submitHandler,
	rating,
	setRating,
	comment,
	setComment,
	loading
}) => {
	// Safety check for product and reviews
	const reviews = product?.reviews || [];

	return (
		<div className="review mt-8 space-y-6">
			<h2 className="text-2xl bg-[#f4f4f4] p-2.5 border border-[#ddd] font-bold text-gray-800">
				Reviews
			</h2>
			{reviews.length === 0 ? (
				<AlertMessage>No Reviews</AlertMessage>
			) : (
				<div className="space-y-6">
					{reviews.map((review) => (
						<div
							key={review._id}
							className="border-b border-gray-200 pb-6 last:border-0"
						>
							<div className="flex justify-between items-start">
								<div>
									<strong className="text-lg font-medium text-gray-900">
										{review.name}
									</strong>
									<div className="mt-1 flex items-center">
										<Rating value={review.rating} />
										<span className="ml-2 text-sm text-gray-500">
											{new Date(review.createdAt).toDateString()}
										</span>
									</div>
								</div>
							</div>
							<p className="mt-3 text-gray-600">{review.comment}</p>
						</div>
					))}
				</div>
			)}
			<div className="pt-4 border-t border-gray-200">
				<h2 className="text-xl font-bold text-gray-800 mb-4">
					Write a Customer Review
				</h2>
				{userInfo ? (
					<form
						onSubmit={submitHandler}
						className="space-y-4"
					>
						<div>
							<label
								htmlFor="rating"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Rating
							</label>
							<select
								id="rating"
								required
								value={rating}
								onChange={(e) => setRating(e.target.value)}
								className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
							>
								<option value="">Select...</option>
								<option value="1">1 - Poor</option>
								<option value="2">2 - Fair</option>
								<option value="3">3 - Good</option>
								<option value="4">4 - Very Good</option>
								<option value="5">5 - Excellent</option>
							</select>
						</div>
						<div>
							<label
								htmlFor="comment"
								className="block text-sm font-medium text-gray-700 mb-1"
							>
								Comment
							</label>
							<textarea
								id="comment"
								rows="4"
								required
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
							></textarea>
						</div>
						<button
							type="submit"
							disabled={loading}
							className={`review-btn w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 mt-2 ${
								loading ? "opacity-70 cursor-not-allowed" : ""
							}`}
						>
							{loading ? "Submitting..." : "Submit Review"}
						</button>
					</form>
				) : (
					<AlertMessage>
						Please{" "}
						<Link
							to="/login"
							className="text-blue-600 hover:text-blue-800 font-medium"
						>
							sign in
						</Link>{" "}
						to write a review
					</AlertMessage>
				)}
			</div>
		</div>
	);
};

export default Reviews;
