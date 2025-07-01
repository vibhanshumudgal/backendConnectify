const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String, // Field type
      required: true, // Validation: Required field
      trim: true, // Remove extra spaces
    },
    email: {
      type: String,
      required: true,
      validate(val) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
          throw new Error("Invalid email format");
        }
      },
    },
    age: {
      type: Number,
      min: 9,
      max: 90,
    },
    password: {
      type: String,
      required: true,
      validate(password) {
        if (!validator.isStrongPassword(password)) {
          throw new Error("Please enter a strong password");
        }
      },
    },
    about: {
      type: String,
      default: "New to the app",
      trim: true,
      maxlength: 40,
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      validate(val) {
        if (val !== "male" && val !== "female" && val !== "other") {
          throw new Error("Invalid gender value");
        }
      },
    },
    isAdmin: {
      type: Boolean,
      default: false, // Default value if not provided
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
    collection: "UserInfo",
  }
);

const User = mongoose.model("User", userSchema, "UserInfo");
module.exports = User;
