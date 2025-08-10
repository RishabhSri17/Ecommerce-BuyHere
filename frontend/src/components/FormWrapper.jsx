import React from "react";

// Default configuration for form wrapper styling
const DEFAULT_CONFIG = {
	maxWidth: "max-w-7xl",
	containerPadding: "px-4 sm:px-6 lg:px-8",
	formWidth: "w-full md:w-2/3 lg:w-1/2",
	alignment: "justify-center"
};

/**
 * FormWrapper - A reusable component for consistent form layout and styling
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form content to be wrapped
 * @param {string} props.maxWidth - Maximum width class (default: 'max-w-7xl')
 * @param {string} props.containerPadding - Container padding classes (default: 'px-4 sm:px-6 lg:px-8')
 * @param {string} props.formWidth - Form width classes (default: 'w-full md:w-2/3 lg:w-1/2')
 * @param {string} props.alignment - Flex alignment class (default: 'justify-center')
 * @param {string} props.additionalClasses - Additional CSS classes to apply
 * @returns {JSX.Element} Wrapped form component
 */
const FormWrapper = ({
	children,
	maxWidth = DEFAULT_CONFIG.maxWidth,
	containerPadding = DEFAULT_CONFIG.containerPadding,
	formWidth = DEFAULT_CONFIG.formWidth,
	alignment = DEFAULT_CONFIG.alignment,
	additionalClasses = ""
}) => {
	// Combine all classes for the main container
	const containerClasses =
		`${maxWidth} mx-auto ${containerPadding} ${additionalClasses}`.trim();

	// Combine all classes for the form wrapper
	const formWrapperClasses = `flex ${alignment}`;

	// Combine all classes for the form container
	const formContainerClasses = formWidth;

	return (
		<div className={containerClasses}>
			<div className={formWrapperClasses}>
				<div className={formContainerClasses}>{children}</div>
			</div>
		</div>
	);
};

export default FormWrapper;
