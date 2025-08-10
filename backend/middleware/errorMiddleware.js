// ========================================
// ERROR HANDLING MIDDLEWARE
// ========================================

// @desc     Handle 404 Not Found errors
// @method   Middleware
// @access   Global
const handleRouteNotFound = (req, res, next) => {
	const errorMessage = `Route not found: ${req.originalUrl}`;
	const notFoundError = new Error(errorMessage);

	res.status(404);
	next(notFoundError);
};

// @desc     Global error handler middleware
// @method   Middleware
// @access   Global
const handleGlobalErrors = (err, req, res, next) => {
	// Determine the appropriate status code
	const errorStatusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(errorStatusCode);

	// Prepare error response based on environment
	const errorResponse = {
		message: err.message || "Internal Server Error",
		status: errorStatusCode,
		timestamp: new Date().toISOString(),
		path: req.originalUrl,
		method: req.method
	};

	// Include stack trace only in development
	if (process.env.NODE_ENV === "development") {
		errorResponse.stack = err.stack;
	} else {
		errorResponse.stack = "🔒 Stack trace hidden in production";
	}

	// Log error details
	console.error("🚨 Error Details:", {
		message: err.message,
		status: errorStatusCode,
		path: req.originalUrl,
		method: req.method,
		timestamp: new Date().toISOString(),
		stack: process.env.NODE_ENV === "development" ? err.stack : "Hidden"
	});

	// Send error response
	res.json(errorResponse);
};

module.exports = {
	handleRouteNotFound,
	handleGlobalErrors
};
