import React from "react";
import { Link } from "react-router-dom";

// ========================================
// CHECKOUT PROGRESS INDICATOR COMPONENT
// ========================================

// @desc     Displays checkout progress steps with navigation
// @method   Component
// @access   Public
const CheckoutProgressIndicator = ({ step1, step2, step3, step4 }) => {
	// Define checkout steps configuration
	const checkoutStepsConfig = [
		{
			id: 1,
			isActive: step1,
			label: "Sign In",
			path: "/login",
			isCompleted: step1
		},
		{
			id: 2,
			isActive: step2,
			label: "Shipping",
			path: "/shipping",
			isCompleted: step2
		},
		{
			id: 3,
			isActive: step3,
			label: "Payment",
			path: "/payment",
			isCompleted: step3
		},
		{
			id: 4,
			isActive: step4,
			label: "Place Order",
			path: "/place-order",
			isCompleted: step4
		}
	];

	// Render individual step component
	const renderCheckoutStep = (stepConfig) => {
		const { id, isActive, label, path, isCompleted } = stepConfig;

		const stepLinkClasses = isActive
			? "text-blue-600 hover:text-blue-800 font-medium transition-colors"
			: "text-gray-400 cursor-not-allowed";

		const progressBarClasses = isCompleted ? "bg-blue-600" : "bg-gray-300";

		return (
			<div
				key={id}
				className="flex flex-col items-center"
			>
				{isActive ? (
					<Link
						to={path}
						className={stepLinkClasses}
					>
						{label}
					</Link>
				) : (
					<span className={stepLinkClasses}>{label}</span>
				)}
				<div className={`h-1 w-16 mt-1 ${progressBarClasses}`}></div>
			</div>
		);
	};

	// Render step separator
	const renderStepSeparator = () => <div className="mx-2 text-gray-400">›</div>;

	return (
		<div className="flex justify-center mb-8">
			<div className="flex items-center">
				{checkoutStepsConfig.map((stepConfig, index) => (
					<React.Fragment key={stepConfig.id}>
						{renderCheckoutStep(stepConfig)}
						{index < checkoutStepsConfig.length - 1 && renderStepSeparator()}
					</React.Fragment>
				))}
			</div>
		</div>
	);
};

export default CheckoutProgressIndicator;
