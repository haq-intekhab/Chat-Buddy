const User = require("../models/useModel");
const generateToken = require("../config/generateToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      return res.status(402).json({
        error: "Please add all the fields",
      });
    }

    const userExisted = await User.findOne({ email: email });
    if (userExisted) {
      return res.status(400).json({
        error: "User already exists with that email",
      });
    }

    let hashPassword = password;
    try {
      hashPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    let user = await User.create({
      name,
      email,
      password: hashPassword,
      pic,
    });

    const payload = {
      email: user.email,
      id: user._id,
    };

    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user = user.toObject();
    user.token = token;
    user.password = undefined;

    res.status(201).json({
      message: "User created successfully!",
      user: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(402).json({
        error: "Please provide email and password",
      });
    }

    let user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        error: "User does not exist with that email",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }

    const payload = {
      email: user.email,
      id: user._id,
    };

    let token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    user = user.toObject();
    user.token = token;
    user.password = undefined;

    res.status(200).json({
      message: "Login successful!",
      token,
      user: user
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });
  res.status(200).json({ users });
}; 