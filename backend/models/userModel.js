const mongoose = require('mongoose');

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    // User's name
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    // User's email, must be unique
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, 'Email is too long'],
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    // User's password
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
    },
    // Indicates whether the user is an admin or not
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    // Security fields for account protection
    failedLoginAttempts: {
      type: Number,
      default: 0,
      min: 0
    },
    isLocked: {
      type: Boolean,
      default: false
    },
    lockUntil: {
      type: Date,
      default: null
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    // Email verification fields
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    emailVerificationToken: {
      type: String,
      default: null
    },
    emailVerificationExpires: {
      type: Date,
      default: null
    }
  },
  { 
    timestamps: true, // Adds createdAt and updatedAt timestamps
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ isAdmin: 1 });
userSchema.index({ isLocked: 1 });

// Virtual for checking if account is currently locked
userSchema.virtual('isCurrentlyLocked').get(function() {
  if (!this.isLocked) return false;
  if (!this.lockUntil) return false;
  return this.lockUntil > new Date();
});

// Pre-save middleware to ensure email is lowercase
userSchema.pre('save', function(next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase().trim();
  }
  next();
});

// Method to check if account should be unlocked
userSchema.methods.shouldUnlock = function() {
  if (!this.isLocked) return false;
  if (!this.lockUntil) return false;
  return this.lockUntil <= new Date();
};

// Method to unlock account
userSchema.methods.unlockAccount = function() {
  this.isLocked = false;
  this.lockUntil = null;
  this.failedLoginAttempts = 0;
  return this.save();
};

// Method to increment failed login attempts
userSchema.methods.incrementFailedAttempts = function() {
  this.failedLoginAttempts += 1;
  
  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.isLocked = true;
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
  }
  
  return this.save();
};

// Method to reset failed login attempts
userSchema.methods.resetFailedAttempts = function() {
  this.failedLoginAttempts = 0;
  this.isLocked = false;
  this.lockUntil = null;
  this.lastLoginAt = new Date();
  return this.save();
};

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the User model
module.exports = User;
