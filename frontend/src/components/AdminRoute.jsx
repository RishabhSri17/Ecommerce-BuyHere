import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// ========================================
// ADMIN ROUTE PROTECTION COMPONENT
// ========================================

// @desc     Protected route component for admin-only access
// @method   Component
// @access   Private/Admin
const ProtectedAdminRoute = () => {
	// Get user information from Redux store
	const { userInfo } = useSelector((state) => state.auth);

	// Validate admin access requirements
	const hasValidAdminAccess = userInfo && userInfo.isAdmin === true;

	// Render admin content if user has valid admin access, otherwise redirect to admin login
	return hasValidAdminAccess ? (
		<Outlet />
	) : (
		<Navigate
			to="/admin/login"
			replace
		/>
	);
};

export default ProtectedAdminRoute;
