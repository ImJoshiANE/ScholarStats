const User = require("../Models/User");
const AppError = require("../utils/appError");
const crypto = require("crypto");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
// const { promisify } = require("util");
// const sendEmail = require("../utils/email");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60000),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = ture;

  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, gsId } = req.body;

  const user = await User.findOne({ email });
  if (!!user) {
    return next(new AppError("This email is already registered!", 400));
  }

  const newUser = await User.create({
    name: name,
    email: email,
    password: password,
    gsId: gsId
  });

  createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // console.log({email, password});

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("No user found with this email!", 401));
  }

  const userIsValid = await user.checkPassword(password, user.password);
  if (!userIsValid) {
    return next(new AppError("Incorrect Password!", 401));
  }

  createAndSendToken(user, 200, res);
});
