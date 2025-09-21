const jwt = require("jsonwebtoken");

// ========================================
// JWT TOKEN UTILITIES
// ========================================

// @desc     Create and set JWT authentication token
// @method   Utility
// @access   Internal
const createAndSetAuthToken = (req, res, userId, remember = false) => {
	try {
		// Validate required parameters
		if (!userId) {
			throw new Error("User ID is required for token generation");
		}

		if (!process.env.JWT_SECRET) {
			throw new Error("JWT secret is not configured");
		}

		// Determine token expiration based on remember me option
		const tokenExpiration = remember ? "30d" : "24h";
		const cookieMaxAge = remember
			? 30 * 24 * 60 * 60 * 1000 // 30 days
			: 24 * 60 * 60 * 1000; // 24 hours

		// Generate JWT token with additional security claims
		const authToken = jwt.sign(
			{
				userId,
				iat: Math.floor(Date.now() / 1000),
				iss: "buyhere-api",
				aud: "buyhere-client"
			},
			process.env.JWT_SECRET,
			{
				expiresIn: tokenExpiration,
				algorithm: "HS256"
			}
		);

		// Configure cookie options with enhanced security
		const cookieOptions = {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "none",
			/* sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", */
			maxAge: cookieMaxAge,
			path: "/",
			domain:
				process.env.NODE_ENV === "production"
					? process.env.COOKIE_DOMAIN
					: undefined
		};

		// Set JWT as HTTP-only cookie
		res.cookie("jwt", authToken, cookieOptions);

		// Log token generation
		console.log("🔐 Authentication token generated:", {
			userId: userId,
			expiresIn: tokenExpiration,
			rememberMe: remember,
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error("🚨 Token generation error:", {
			userId: userId,
			error: error.message,
			timestamp: new Date().toISOString()
		});
		throw new Error(`Token generation failed: ${error.message}`);
	}
};

// @desc     Clear JWT authentication token
// @method   Utility
// @access   Internal
const clearAuthToken = (res) => {
	try {
		// Clear the JWT cookie with same options as when it was set
		res.clearCookie("jwt", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
			path: "/",
			domain:
				process.env.NODE_ENV === "production"
					? process.env.COOKIE_DOMAIN
					: undefined
		});

		console.log("🔓 Authentication token cleared:", {
			timestamp: new Date().toISOString()
		});
	} catch (error) {
		console.error("🚨 Token clearing error:", {
			error: error.message,
			timestamp: new Date().toISOString()
		});
		throw new Error(`Token clearing failed: ${error.message}`);
	}
};

// @desc     Verify JWT token validity
// @method   Utility
// @access   Internal
const verifyAuthToken = (token) => {
	try {
		if (!token) {
			throw new Error("Token is required for verification");
		}

		if (!process.env.JWT_SECRET) {
			throw new Error("JWT secret is not configured");
		}

		// Verify and decode the token with additional options
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {
			algorithms: ["HS256"],
			issuer: "buyhere-api",
			audience: "buyhere-client"
		});

		console.log("✅ Token verification successful:", {
			userId: decodedToken.userId,
			timestamp: new Date().toISOString()
		});

		return decodedToken;
	} catch (error) {
		console.error("❌ Token verification failed:", {
			error: error.message,
			timestamp: new Date().toISOString()
		});

		if (error.name === "TokenExpiredError") {
			throw new Error("Token has expired");
		} else if (error.name === "JsonWebTokenError") {
			throw new Error("Invalid token format");
		} else if (error.name === "NotBeforeError") {
			throw new Error("Token not yet valid");
		} else {
			throw new Error(`Token verification failed: ${error.message}`);
		}
	}
};

// @desc     Generate a secure random token for password reset
// @method   Utility
// @access   Internal
const generateSecureToken = (length = 32) => {
	const crypto = require("crypto");
	return crypto.randomBytes(length).toString("hex");
};

// @desc     Generate email verification token
// @method   Utility
// @access   Internal
const generateEmailVerificationToken = () => {
	return generateSecureToken(32);
};

module.exports = {
	createAndSetAuthToken,
	clearAuthToken,
	verifyAuthToken,
	generateSecureToken,
	generateEmailVerificationToken
};
