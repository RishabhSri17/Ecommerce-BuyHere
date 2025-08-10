const path = require("path");
const fs = require("fs");

// ========================================
// FILE SYSTEM UTILITIES
// ========================================

// @desc     Remove file from filesystem
// @method   Utility
// @access   Internal
const removeFileFromSystem = (filePath) => {
	try {
		// Resolve the absolute path
		const absoluteFilePath = path.join(path.resolve(), filePath);

		// Check if file exists before attempting to delete
		if (fs.existsSync(absoluteFilePath)) {
			// Remove file asynchronously
			fs.unlink(absoluteFilePath, (error) => {
				if (error) {
					console.error("❌ File deletion error:", {
						filePath: absoluteFilePath,
						error: error.message,
						timestamp: new Date().toISOString()
					});
					throw new Error(`Failed to delete file: ${error.message}`);
				}

				console.log("✅ File deleted successfully:", {
					filePath: absoluteFilePath,
					timestamp: new Date().toISOString()
				});
			});
		} else {
			console.log("⚠️  File not found for deletion:", {
				filePath: absoluteFilePath,
				timestamp: new Date().toISOString()
			});
		}
	} catch (error) {
		console.error("🚨 File utility error:", {
			filePath: filePath,
			error: error.message,
			timestamp: new Date().toISOString()
		});
		throw new Error(`File operation failed: ${error.message}`);
	}
};

// @desc     Check if file exists in filesystem
// @method   Utility
// @access   Internal
const checkFileExists = (filePath) => {
	try {
		const absoluteFilePath = path.join(path.resolve(), filePath);
		return fs.existsSync(absoluteFilePath);
	} catch (error) {
		console.error("🚨 File existence check error:", {
			filePath: filePath,
			error: error.message,
			timestamp: new Date().toISOString()
		});
		return false;
	}
};

// @desc     Get file information
// @method   Utility
// @access   Internal
const getFileInfo = (filePath) => {
	try {
		const absoluteFilePath = path.join(path.resolve(), filePath);

		if (!fs.existsSync(absoluteFilePath)) {
			return null;
		}

		const fileStats = fs.statSync(absoluteFilePath);
		return {
			path: absoluteFilePath,
			size: fileStats.size,
			created: fileStats.birthtime,
			modified: fileStats.mtime,
			isFile: fileStats.isFile(),
			isDirectory: fileStats.isDirectory()
		};
	} catch (error) {
		console.error("🚨 File info retrieval error:", {
			filePath: filePath,
			error: error.message,
			timestamp: new Date().toISOString()
		});
		return null;
	}
};

module.exports = {
	removeFileFromSystem,
	checkFileExists,
	getFileInfo
};
