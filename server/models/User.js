// Initialize Mongoose
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  gsId: {
    type: String,
    required: true,
    ref: "ScholarData",
  },
});

userSchema.pre("save", async function (next) {
  // Returns if password is not modified
  if (!this.isModified("password")) return next();
  // Hashing the password with random salt and cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.checkPassword = async function (
  providedPassword,
  actualPassword
) {
  return await bcrypt.compare(providedPassword, actualPassword);
};

const User = mongoose.model("User", userSchema); // Create User model
module.exports = User; // Export User model
