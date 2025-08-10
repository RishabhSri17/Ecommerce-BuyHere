import mongoose from "mongoose";
import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";
import colors from "colors";
import "dotenv/config";

// ========================================
// DATABASE SEEDER UTILITIES
// ========================================

// @desc     Import sample data into database
// @method   Utility
// @access   Internal
const populateDatabaseWithSampleData = async () => {
	try {
		console.log("🔄 Starting database population...".yellow);

		// Clear existing data
		await Order.deleteMany();
		await User.deleteMany();
		await Product.deleteMany();

		console.log("🗑️  Existing data cleared successfully".blue);

		// Import users
		const createdUsers = await User.insertMany(users);
		console.log(`👥 ${createdUsers.length} users imported successfully`.green);

		// Get admin user ID for product association
		const adminUserId = createdUsers[0]._id;

		// Prepare products with admin user association
		const productsWithUser = products.map((product) => {
			return { ...product, user: adminUserId };
		});

		// Import products
		const createdProducts = await Product.insertMany(productsWithUser);
		console.log(
			`📦 ${createdProducts.length} products imported successfully`.green
		);

		// Log successful completion
		console.log("✅ Database population completed successfully!".green.inverse);
		console.log("📊 Summary:", {
			users: createdUsers.length,
			products: createdProducts.length,
			timestamp: new Date().toISOString()
		});

		process.exit(0);
	} catch (error) {
		console.error("🚨 Database population error:", {
			error: error.message,
			timestamp: new Date().toISOString()
		});
		console.log(`❌ Error: ${error.message}`.red.inverse);
		process.exit(1);
	}
};

// @desc     Clear all data from database
// @method   Utility
// @access   Internal
const clearAllDatabaseData = async () => {
	try {
		console.log("🔄 Starting database cleanup...".yellow);

		// Clear all collections
		const orderResult = await Order.deleteMany();
		const userResult = await User.deleteMany();
		const productResult = await Product.deleteMany();

		console.log("🗑️  Database cleanup completed successfully".blue);

		// Log cleanup summary
		console.log("✅ Database cleanup completed successfully!".red.inverse);
		console.log("📊 Cleanup Summary:", {
			ordersDeleted: orderResult.deletedCount,
			usersDeleted: userResult.deletedCount,
			productsDeleted: productResult.deletedCount,
			timestamp: new Date().toISOString()
		});

		process.exit(0);
	} catch (error) {
		console.error("🚨 Database cleanup error:", {
			error: error.message,
			timestamp: new Date().toISOString()
		});
		console.log(`❌ Error: ${error.message}`.red.inverse);
		process.exit(1);
	}
};

// @desc     Initialize database connection
// @method   Utility
// @access   Internal
const initializeDatabaseConnection = async () => {
	try {
		await connectDB();
		console.log("🔗 Database connection established".green);
	} catch (error) {
		console.error("🚨 Database connection failed:", {
			error: error.message,
			timestamp: new Date().toISOString()
		});
		process.exit(1);
	}
};

// ========================================
// MAIN EXECUTION
// ========================================

// Initialize database connection
initializeDatabaseConnection();

// Execute based on command line argument
if (process.argv[2] === "-d") {
	clearAllDatabaseData();
} else {
	populateDatabaseWithSampleData();
}

module.exports = {
	populateDatabaseWithSampleData,
	clearAllDatabaseData,
	initializeDatabaseConnection
};
