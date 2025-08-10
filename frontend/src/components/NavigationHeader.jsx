import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { clearUserAuthentication } from "../slices/userAuthenticationSlice";
import { toast } from "react-toastify";
import SearchBox from "./SearchBox";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";

/**
 * NavigationHeader - Main navigation component with cart, user auth, and responsive menu
 * @returns {JSX.Element} Navigation header component
 */
const NavigationHeader = () => {
	// Redux state selectors
	const { cartItems } = useSelector((state) => state.cart);
	const { userInfo } = useSelector((state) => state.auth);

	// API hooks and navigation
	const [logoutApiCall, { isLoading: isLoggingOut }] = useLogoutMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	// Local state for UI interactions
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

	// Computed values with safety checks
	const safeCartItems = cartItems || [];
	const totalCartItems = safeCartItems.reduce((acc, item) => acc + item.qty, 0);
	const hasCartItems = safeCartItems.length > 0;

	/**
	 * Handles user logout process
	 */
	const handleUserLogout = async () => {
		try {
			// Call logout API
			await logoutApiCall().unwrap();

			// Clear local authentication state
			dispatch(clearUserAuthentication());

			// Navigate to login page
			navigate("/login");

			// Show success message
			toast.success("Logout successful. Come back soon!");

			// Close any open menus
			closeAllMenus();
		} catch (error) {
			console.error("Logout error:", error);

			// Even if API call fails, clear local state for security
			dispatch(clearUserAuthentication());
			navigate("/login");

			// Show appropriate error message
			if (error?.status === 401) {
				toast.info("Session expired. Please log in again.");
			} else if (error?.status >= 500) {
				toast.error("Server error during logout. Please try again.");
			} else {
				toast.error("Logout failed. Please try again.");
			}

			// Close any open menus
			closeAllMenus();
		}
	};

	/**
	 * Closes all mobile menus and dropdowns
	 */
	const closeAllMenus = () => {
		setIsMobileMenuOpen(false);
		setIsUserDropdownOpen(false);
	};

	/**
	 * Toggles mobile menu visibility
	 */
	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		// Close user dropdown when mobile menu is opened
		if (!isMobileMenuOpen) {
			setIsUserDropdownOpen(false);
		}
	};

	/**
	 * Toggles user dropdown visibility
	 */
	const toggleUserDropdown = () => {
		setIsUserDropdownOpen(!isUserDropdownOpen);
		// Close mobile menu when user dropdown is opened
		if (!isUserDropdownOpen) {
			setIsMobileMenuOpen(false);
		}
	};

	/**
	 * Handles logout with menu cleanup
	 */
	const handleLogoutWithCleanup = () => {
		closeAllMenus();
		handleUserLogout();
	};

	/**
	 * Handles profile navigation with menu cleanup
	 */
	const handleProfileNavigation = () => {
		closeAllMenus();
		navigate("/profile");
	};

	return (
		<nav className="fixed top-0 w-full z-20 bg-[#98CD00] text-white shadow-md">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					{/* Brand Logo Section */}
					<div className="flex items-center">
						<Link
							to="/"
							className="text-xl font-bold"
							onClick={closeAllMenus}
						>
							BuyHere
						</Link>
					</div>

					{/* Desktop Search Section */}
					<div className="hidden md:flex items-center flex-1 max-w-lg mx-6">
						<SearchBox />
					</div>

					{/* Desktop Navigation Section */}
					<div className="hidden md:flex items-center space-x-6">
						{/* Cart Link */}
						<Link
							to="/cart"
							className="flex items-center hover:text-gray-200 transition-colors"
						>
							<FaShoppingCart className="mr-1" />
							Cart
							{hasCartItems && (
								<span className="ml-1 bg-yellow-400 text-gray-900 rounded-full px-2 py-0.5 text-xs font-bold">
									{totalCartItems}
								</span>
							)}
						</Link>

						{/* User Authentication Section */}
						{userInfo ? (
							<div className="relative">
								<button
									onClick={toggleUserDropdown}
									className="flex items-center hover:text-gray-200 transition-colors"
									disabled={isLoggingOut}
								>
									<span>Hello👋, {userInfo.name}</span>
								</button>

								{isUserDropdownOpen && (
									<div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-30">
										<button
											onClick={handleProfileNavigation}
											className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
										>
											Profile
										</button>
										<button
											onClick={handleLogoutWithCleanup}
											disabled={isLoggingOut}
											className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isLoggingOut ? "Logging out..." : "Logout"}
										</button>
									</div>
								)}
							</div>
						) : (
							<Link
								to="/login"
								className="flex items-center hover:text-gray-200 transition-colors"
							>
								<FaUser className="mr-1" />
								Sign In
							</Link>
						)}
					</div>

					{/* Mobile Menu Controls */}
					<div className="flex items-center md:hidden">
						{/* Mobile Cart Link */}
						<Link
							to="/cart"
							className="relative p-2 mr-2 hover:text-gray-200"
							onClick={closeAllMenus}
						>
							<FaShoppingCart className="text-xl" />
							{hasCartItems && (
								<span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
									{totalCartItems}
								</span>
							)}
						</Link>

						{/* Mobile Menu Toggle Button */}
						<button
							onClick={toggleMobileMenu}
							className="p-2 hover:text-gray-200 focus:outline-none"
						>
							{isMobileMenuOpen ? (
								<FaTimes className="text-xl" />
							) : (
								<FaBars className="text-xl" />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			{isMobileMenuOpen && (
				<div className="md:hidden bg-[#98CD00] px-4 pb-4 shadow-lg">
					{/* Mobile Search */}
					<div className="mb-4">
						<SearchBox />
					</div>

					{/* Mobile Navigation Links */}
					<div className="space-y-3">
						{userInfo ? (
							<>
								<div className="px-2 py-1">Hello👋, {userInfo.name}</div>
								<button
									onClick={handleProfileNavigation}
									className="block w-full text-left px-2 py-1 hover:bg-[#8abe00] rounded"
								>
									Profile
								</button>
								<button
									onClick={handleLogoutWithCleanup}
									disabled={isLoggingOut}
									className="block w-full text-left px-2 py-1 hover:bg-[#8abe00] rounded disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isLoggingOut ? "Logging out..." : "Logout"}
								</button>
							</>
						) : (
							<Link
								to="/login"
								onClick={closeAllMenus}
								className="flex items-center px-2 py-1 hover:bg-[#8abe00] rounded"
							>
								<FaUser className="mr-2" />
								Sign In
							</Link>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default NavigationHeader;
