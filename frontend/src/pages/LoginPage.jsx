import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setUserCredentials } from "../slices/userAuthenticationSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormWrapper from "../components/FormWrapper";
import SpinningCubeLoader from "../components/SpinningCubeLoader";
import Meta from "../components/Meta";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		remember: false
	});
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [login, { isLoading }] = useLoginMutation();

	const { userInfo } = useSelector((state) => state.auth);

	const { search } = useLocation();
	const searchParams = new URLSearchParams(search);
	const redirect = searchParams.get("redirect") || "/";

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [userInfo, redirect, navigate]);

	// Client-side validation
	const validateForm = () => {
		const newErrors = {};

		// Email validation
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ""
			}));
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		
		// Validate form
		if (!validateForm()) {
			return;
		}

		try {
			const res = await login({
				email: formData.email.trim(),
				password: formData.password,
				remember: formData.remember
			}).unwrap();
			
			dispatch(setUserCredentials({ ...res }));
			navigate(redirect);
			toast.success("Login successful! Welcome back!");
		} catch (error) {
			console.error("Login error:", error);
			
			// Handle different types of errors
			if (error?.status === 401) {
				toast.error("Invalid email or password. Please try again.");
			} else if (error?.status === 423) {
				toast.error("Account is temporarily locked. Please try again later.");
			} else if (error?.status === 429) {
				toast.error("Too many login attempts. Please wait before trying again.");
			} else if (error?.status === 400) {
				toast.error(error?.data?.message || "Please check your input and try again.");
			} else if (error?.status >= 500) {
				toast.error("Server error. Please try again later.");
			} else {
				toast.error(error?.data?.message || "Login failed. Please try again.");
			}
		}
	};

	return (
		<FormWrapper>
			<Meta title={"Sign In"} />
			<h1 className="text-2xl font-bold mb-6">Sign In</h1>
			<form
				onSubmit={submitHandler}
				className="space-y-4"
			>
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
						name="email"
						className={`w-full border rounded px-3 py-2 ${
							errors.email ? 'border-red-500' : 'border-gray-300'
						}`}
						value={formData.email}
						placeholder="Enter email"
						onChange={handleInputChange}
						disabled={isLoading}
					/>
					{errors.email && (
						<p className="text-red-500 text-sm mt-1">{errors.email}</p>
					)}
				</div>
				<div>
					<label
						htmlFor="password"
						className="block font-medium mb-1"
					>
						Password
					</label>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							id="password"
							name="password"
							className={`w-full border rounded px-3 py-2 pr-10 ${
								errors.password ? 'border-red-500' : 'border-gray-300'
							}`}
							value={formData.password}
							placeholder="Enter password"
							onChange={handleInputChange}
							disabled={isLoading}
						/>
						<span
							className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
							onClick={togglePasswordVisibility}
						>
							{showPassword ? <FaEyeSlash /> : <FaEye />}
						</span>
					</div>
					{errors.password && (
						<p className="text-red-500 text-sm mt-1">{errors.password}</p>
					)}
				</div>
				<div className="flex items-center">
					<input
						type="checkbox"
						id="remember"
						name="remember"
						checked={formData.remember}
						onChange={handleInputChange}
						className="mr-2"
						disabled={isLoading}
					/>
					<label
						htmlFor="remember"
						className="text-sm"
					>
						Remember me for 30 days
					</label>
				</div>
				<button
					type="submit"
					className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
					disabled={isLoading}
				>
					{isLoading ? (
						<div className="flex items-center justify-center">
							<SpinningCubeLoader size="small" />
							<span className="ml-2">Signing In...</span>
						</div>
					) : (
						"Sign In"
					)}
				</button>
				<div className="text-center space-y-2">
					<div>
						New Customer?{" "}
						<Link
							to={redirect ? `/register?redirect=${redirect}` : "/register"}
							className="text-blue-600 hover:underline"
						>
							Register
						</Link>
					</div>
					<div>
						<Link
							to="/reset-password-request"
							className="text-blue-600 hover:underline text-sm"
						>
							Forgot your password?
						</Link>
					</div>
				</div>
			</form>
		</FormWrapper>
	);
};

export default LoginPage;
