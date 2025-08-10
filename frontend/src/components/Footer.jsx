import React from "react";

// ========================================
// SITE FOOTER COMPONENT
// ========================================

// @desc     Footer component for the application with copyright information
// @method   Component
// @access   Public
const SiteFooter = () => {
	// Get current year for copyright
	const currentYear = new Date().getFullYear();

	// Application branding information
	const applicationBrand = "MERN Shop";

	return (
		<footer className="w-full py-6 bg-gray-50 mt-auto">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center">
					<p className="text-gray-600">
						{applicationBrand} &copy; {currentYear}
					</p>
				</div>
			</div>
		</footer>
	);
};

export default SiteFooter;
