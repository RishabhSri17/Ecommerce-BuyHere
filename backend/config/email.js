const nodemailer = require("nodemailer");

// Email service configuration
const emailServiceConfig = {
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: false,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
};

// Create email transporter instance
const emailTransporter = nodemailer.createTransport(emailServiceConfig);

// Validate email configuration
const validateEmailConfig = () => {
	const requiredEnvVars = [
		"EMAIL_HOST",
		"EMAIL_PORT",
		"EMAIL_USER",
		"EMAIL_PASS",
		"EMAIL_FROM"
	];
	const missingVars = requiredEnvVars.filter(
		(varName) => !process.env[varName]
	);

	if (missingVars.length > 0) {
		throw new Error(
			`Missing required email environment variables: ${missingVars.join(", ")}`
		);
	}
};

// Send email function with error handling
const sendEmail = async (emailOptions) => {
	try {
		validateEmailConfig();

		const defaultOptions = {
			from: `"MERN Shop" ${process.env.EMAIL_FROM}`,
			...emailOptions
		};

		const result = await emailTransporter.sendMail(defaultOptions);
		console.log("Email sent successfully:", result.messageId);
		return result;
	} catch (error) {
		console.error("Email sending failed:", error.message);
		throw new Error(`Failed to send email: ${error.message}`);
	}
};

// Send password reset email
const sendPasswordResetEmail = async (userEmail, userName, resetLink) => {
	const emailContent = {
		to: userEmail,
		subject: "Password Reset Request",
		html: `
      <p>Hi ${userName},</p>
      
      <p>We received a password reset request for your account. Click the link below to set a new password:</p>
      
      <p><a href="${resetLink}" target="_blank">${resetLink}</a></p>
      
      <p>If you didn't request this, you can ignore this email.</p>
      
      <p>Thanks,<br>
      MERN Shop Team</p>
    `
	};

	return await sendEmail(emailContent);
};

// Test email connection
const testEmailConnection = async () => {
	try {
		validateEmailConfig();
		await emailTransporter.verify();
		console.log("Email service connection verified successfully");
		return true;
	} catch (error) {
		console.error("Email service connection failed:", error.message);
		return false;
	}
};

module.exports = {
	emailTransporter,
	sendEmail,
	sendPasswordResetEmail,
	testEmailConnection,
	validateEmailConfig
};
