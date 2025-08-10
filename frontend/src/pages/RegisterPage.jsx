import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setUserCredentials } from "../slices/userAuthenticationSlice";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaCheck, FaTimes } from "react-icons/fa";
import FormWrapper from "../components/FormWrapper";
import SpinningCubeLoader from "../components/SpinningCubeLoader";
import Meta from "../components/Meta";

const RegisterPage = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: ""
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [passwordStrength, setPasswordStrength] = useState({
		length: false,
		uppercase: false,
		lowercase: false,
		number: false,
		special: false
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [register, { isLoading }] = useRegisterMutation();

	const { userInfo } = useSelector((state) => state.auth);

	const { search } = useLocation();
	const searchParams = new URLSearchParams(search);
	const redirect = searchParams.get("redirect") || "/";

	useEffect(() => {
		if (userInfo) {
			navigate(redirect);
		}
	}, [userInfo, redirect, navigate]);

	// Password strength checker
	useEffect(() => {
		const password = formData.password;
		setPasswordStrength({
			length: password.length >= 8,
			uppercase: /[A-Z]/.test(password),
			lowercase: /[a-z]/.test(password),
			number: /\d/.test(password),
			special: /[@$!%*?&]/.test(password)
		});
	}, [formData.password]);

	const validateForm = () => {
		const newErrors = {};

		// Name validation
		if (!formData.name.trim()) {
			newErrors.name = "Name is required";
		} else if (formData.name.trim().length < 2) {
			newErrors.name = "Name must be at least 2 characters long";
		} else if (formData.name.trim().length > 50) {
			newErrors.name = "Name cannot exceed 50 characters";
		} else if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
			newErrors.name = "Name can only contain letters and spaces";
		}

		// Email validation
		if (!formData.email.trim()) {
			newErrors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid email address";
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required";
		} else if (formData.password.length < 8) {
			newErrors.password = "Password must be at least 8 characters long";
		} else if (!Object.values(passwordStrength).every(Boolean)) {
			newErrors.password = "Password does not meet security requirements";
		}

		// Confirm password validation
		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Please confirm your password";
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
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

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const submitHandler = async (e) => {
		e.preventDefault();
		
		if (!validateForm()) {
			return;
		}

		try {
			const res = await register({
				name: formData.name.trim(),
				email: formData.email.trim(),
				password: formData.password
			}).unwrap();
			
			dispatch(setUserCredentials({ ...res }));
			navigate(redirect);
			toast.success("Registration successful! Welcome to BuyHere!");
		} catch (error) {
			console.error("Registration error:", error);
			
			// Handle different types of errors
			if (error?.status === 409) {
				toast.error("An account with this email already exists. Please try logging in instead.");
			} else if (error?.status === 400) {
				toast.error(error?.data?.message || "Please check your input and try again.");
			} else if (error?.status >= 500) {
				toast.error("Server error. Please try again later.");
			} else {
				toast.error(error?.data?.message || "Registration failed. Please try again.");
			}
		}
	};

	const PasswordStrengthIndicator = () => (
		<div className="mt-2 space-y-1">
			<p className="text-sm font-medium">Password requirements:</p>
			<div className="space-y-1">
				{Object.entries(passwordStrength).map(([key, isValid]) => (
					<div key={key} className="flex items-center text-sm">
						{isValid ? (
							<FaCheck className="text-green-500 mr-2" />
						) : (
							<FaTimes className="text-red-500 mr-2" />
						)}
						<span className={isValid ? "text-green-600" : "text-red-600"}>
							{key === 'length' && 'At least 8 characters'}
							{key === 'uppercase' && 'One uppercase letter'}
							{key === 'lowercase' && 'One lowercase letter'}
							{key === 'number' && 'One number'}
							{key === 'special' && 'One special character (@$!%*?&)'}
						</span>
					</div>
				))}
			</div>
		</div>
	);

	return (
		<FormWrapper>
			<Meta title={"Register"} />
			<h1 className="text-2xl font-bold mb-6">Sign Up</h1>
			<form
				onSubmit={submitHandler}
				className="space-y-4"
			>
				<div>
					<label
						htmlFor="name"
						className="block font-medium mb-1"
					>
						Full Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						className={`w-full border rounded px-3 py-2 ${
							errors.name ? 'border-red-500' : 'border-gray-300'
						}`}
						value={formData.name}
						placeholder="Enter your full name"
						onChange={handleInputChange}
						disabled={isLoading}
					/>
					{errors.name && (
						<p className="text-red-500 text-sm mt-1">{errors.name}</p>
					)}
				</div>
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
					{formData.password && <PasswordStrengthIndicator />}
					{errors.password && (
						<p className="text-red-500 text-sm mt-1">{errors.password}</p>
					)}
				</div>
				<div>
					<label
						htmlFor="confirmPassword"
						className="block font-medium mb-1"
					>
						Confirm Password
					</label>
					<div className="relative">
						<input
							type={showConfirmPassword ? "text" : "password"}
							id="confirmPassword"
							name="confirmPassword"
							className={`w-full border rounded px-3 py-2 pr-10 ${
								errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
							}`}
							value={formData.confirmPassword}
							placeholder="Confirm password"
							onChange={handleInputChange}
							disabled={isLoading}
						/>
						<span
							className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
							onClick={toggleConfirmPasswordVisibility}
						>
							{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
						</span>
					</div>
					{errors.confirmPassword && (
						<p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
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
							<span className="ml-2">Creating Account...</span>
						</div>
					) : (
						"Create Account"
					)}
				</button>
				<div className="text-center">
					Already have an account?{" "}
					<Link
						to={redirect ? `/login?redirect=${redirect}` : "/login"}
						className="text-blue-600 hover:underline"
					>
						Sign In
					</Link>
				</div>
			</form>
		</FormWrapper>
	);
};

export default RegisterPage;
