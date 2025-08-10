import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNewPasswordRequestMutation } from "../slices/usersApiSlice";
import { toast } from "react-toastify";
import FormWrapper from "../components/FormWrapper";
import SpinningCubeLoader from "../components/SpinningCubeLoader";
import Meta from "../components/Meta";

const ResetPasswordRequestPage = () => {
	const [email, setEmail] = useState("");
	const [errors, setErrors] = useState({});
	const [isSubmitted, setIsSubmitted] = useState(false);

	const [requestReset, { isLoading }] = useNewPasswordRequestMutation();

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Clear previous errors
		setErrors({});

		// Validate email
		if (!email.trim()) {
			setErrors({ email: "Email is required" });
			return;
		}

		if (!validateEmail(email.trim())) {
			setErrors({ email: "Please enter a valid email address" });
			return;
		}

		try {
			await requestReset({ email: email.trim() }).unwrap();
			setIsSubmitted(true);
			toast.success("Password reset email sent! Please check your inbox.");
		} catch (error) {
			console.error("Password reset request error:", error);
			
			if (error?.status === 404) {
				toast.error("No account found with this email address.");
			} else if (error?.status === 400) {
				toast.error(error?.data?.message || "Please check your email and try again.");
			} else if (error?.status >= 500) {
				toast.error("Server error. Please try again later.");
			} else {
				toast.error(error?.data?.message || "Failed to send reset email. Please try again.");
			}
		}
	};

	const handleEmailChange = (e) => {
		setEmail(e.target.value);
		if (errors.email) {
			setErrors({ email: "" });
		}
	};

	if (isSubmitted) {
		return (
			<FormWrapper>
				<Meta title={"Password Reset Requested"} />
				<div className="text-center">
					<div className="mb-6">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
						</div>
						<h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
						<p className="text-gray-600 mb-4">
							We've sent a password reset link to <strong>{email}</strong>
						</p>
						<p className="text-sm text-gray-500 mb-6">
							The link will expire in 15 minutes. If you don't see the email, check your spam folder.
						</p>
					</div>
					<div className="space-y-3">
						<button
							onClick={() => {
								setIsSubmitted(false);
								setEmail("");
							}}
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
						>
							Send Another Email
						</button>
						<Link
							to="/login"
							className="block w-full text-center text-blue-600 hover:underline"
						>
							Back to Sign In
						</Link>
					</div>
				</div>
			</FormWrapper>
		);
	}

	return (
		<FormWrapper>
			<Meta title={"Reset Password"} />
			<div className="text-center mb-6">
				<h1 className="text-2xl font-bold mb-2">Reset Password</h1>
				<p className="text-gray-600">
					Enter your email address and we'll send you a link to reset your password.
				</p>
			</div>
			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="email"
						className="block font-medium mb-1"
					>
						Email address
					</label>
					<input
						type="email"
						id="email"
						className={`w-full border rounded px-3 py-2 ${
							errors.email ? 'border-red-500' : 'border-gray-300'
						}`}
						value={email}
						placeholder="Enter your email"
						onChange={handleEmailChange}
						disabled={isLoading}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">{errors.email}</p>
					)}
				</div>
				<button
					type="submit"
					className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isLoading}
				>
					{isLoading ? (
						<div className="flex items-center justify-center">
							<SpinningCubeLoader size="small" />
							<span className="ml-2">Sending...</span>
						</div>
					) : (
						"Send Reset Link"
					)}
				</button>
				<div className="text-center">
					<Link
						to="/login"
						className="text-blue-600 hover:underline"
					>
						Back to Sign In
					</Link>
				</div>
			</form>
		</FormWrapper>
	);
};

export default ResetPasswordRequestPage;
