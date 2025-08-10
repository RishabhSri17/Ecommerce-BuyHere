import React from "react";

/**
 * AlertMessage - A flexible alert component for displaying various types of messages
 * @param {Object} props - Component props
 * @param {string} props.variant - Alert type (primary, secondary, success, danger, warning, info, light, dark)
 * @param {React.ReactNode} props.children - Content to display in the alert
 * @param {string} props.additionalClasses - Additional CSS classes to apply
 * @returns {JSX.Element} Alert message component
 */
const AlertMessage = ({ 
	variant = "info", 
	children, 
	additionalClasses = "" 
}) => {
	// Alert styling configuration for different variants
	const ALERT_VARIANTS = {
		primary: "bg-blue-100 text-blue-800 border border-blue-300",
		secondary: "bg-gray-100 text-gray-800 border border-gray-300",
		success: "bg-green-100 text-green-800 border border-green-300",
		danger: "bg-red-100 text-red-800 border border-red-300",
		warning: "bg-yellow-100 text-yellow-800 border border-yellow-300",
		info: "bg-blue-100 text-blue-800 border border-blue-300",
		light: "bg-gray-200 text-gray-800 border border-gray-300",
		dark: "bg-gray-800 text-gray-100 border border-gray-900"
	};

	/**
	 * Gets the appropriate CSS classes for the specified variant
	 * @param {string} alertVariant - The variant type
	 * @returns {string} CSS classes for the variant
	 */
	const getVariantClasses = (alertVariant) => {
		return ALERT_VARIANTS[alertVariant] || ALERT_VARIANTS.info;
	};

	/**
	 * Combines base classes with variant-specific classes and additional classes
	 * @returns {string} Complete CSS class string
	 */
	const getCompleteClasses = () => {
		const baseClasses = "rounded-md p-4 mb-4";
		const variantClasses = getVariantClasses(variant);
		return `${baseClasses} ${variantClasses} ${additionalClasses}`.trim();
	};

	return (
		<div className={getCompleteClasses()}>
			{children}
		</div>
	);
};

export default AlertMessage;
