const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");
const paymentRoutes = require("./routes/paymentRoutes.js");

const connectDB = require("./config/db.js");
const { testEmailConnection } = require("./config/email.js");
const {
	handleRouteNotFound,
	handleGlobalErrors
} = require("./middleware/errorMiddleware.js");

const port = process.env.PORT || 5000;

connectDB();

// Test email connection on startup
testEmailConnection().catch(console.error);

const app = express();

// Enhanced CORS configuration - Allow all origins
const corsOptions = {
	origin: true, // Allow all origins
	credentials: true,
	optionsSuccessStatus: 200,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: [
		"Content-Type",
		"Authorization",
		"X-Requested-With",
		"Cookie"
	],
	exposedHeaders: ["Set-Cookie"]
};

app.use(cors(corsOptions));

// Security headers middleware
app.use((req, res, next) => {
	// Prevent clickjacking
	res.setHeader("X-Frame-Options", "DENY");
	// Prevent MIME type sniffing
	res.setHeader("X-Content-Type-Options", "nosniff");
	// Enable XSS protection
	res.setHeader("X-XSS-Protection", "1; mode=block");
	// Referrer policy
	res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

	// Content Security Policy - more permissive for development
	if (process.env.NODE_ENV === "production") {
		res.setHeader(
			"Content-Security-Policy",
			"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
		);
	}
	next();
});

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/payment", paymentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "OK",
		timestamp: new Date().toISOString(),
		uptime: process.uptime()
	});
});

app.get("/", (req, res) => {
	res.send("API is running...");
});

app.use(handleRouteNotFound);
app.use(handleGlobalErrors);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
	console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
