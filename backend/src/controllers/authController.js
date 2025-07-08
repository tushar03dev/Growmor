//Controller/admin + users
import {User} from "../models/model.js";

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require("../utils/prismaImport.js");
require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');
import redisClient from '../config/redis';



const JWT_EXPIRES_IN = '1d';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin},
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists. Please sign in.');
    }

    const otpToken = await sendOTP(email);
    const tempUserData = JSON.stringify({ name, email, password });

    await redisClient.setEx(`signup:${otpToken}`, 300, tempUserData);

    return res.status(200).json({ otpToken, message: 'OTP sent to your email. Please verify.' });
  } catch (err) {
    console.error('Sign-up error:', err);
    res.status(500).send('Server error during sign-up.');
  }
};

// OTP verification route
export const completeSignUp = async (req, res) => {
  const { otpToken, otp } = req.body;

  if (!otpToken || !otp) {
    res.status(400).json({ message: 'Token and OTP are required.' });
    return;
  }

  try {

    const userDataStr = await redisClient.get(`signup:${otpToken}`);
    if (!userDataStr) {
      return res.status(400).json({ message: 'No user data found or token expired.' });
    }

    const { name, email, password } = JSON.parse(userDataStr);

      // Create the new user
      const user = new User({ name: tempUser.name, email: tempUser.email, password: hashedPassword });
      await user.save();


      // Generate JWT token
      const token = jwt.sign({ userId: user._id,  userName: user.name }, process.env.JWT_SECRET, { expiresIn: '1d' });

    await redisClient.del(`signup:${otpToken}`);

      // Respond with token and success message
      res.status(201).json({ token, message: 'OTP verified successfully.User signed up successfully.' });
    } else {
      // OTP verification failed
      res.status(400).json({ message: otpVerificationResult.message });
    }

  } catch (err) {
    console.error('Error verifying OTP:', err);
    res.status(500).send('Error verifying OTP');
  }
}    ;

// Sign-in route
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('User does not exist. Please sign up.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid password');
    }

    const token = jwt.sign({ userId: user._id, userName: user.name}, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, name:user.name });
  } catch (err) {
    console.error('Error during sign-in:', err);
    res.status(500).send('Error during sign-in');
  }
};

exports.signup = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,

      isAdmin: false
    }
  });

  const token = generateToken(user);

  res.status(201).json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,

      isAdmin: user.isAdmin
    }
  });
});

exports.adminSignup = asyncHandler(async (req, res) => {
  const { email, password, adminKey } = req.body;

  if (!adminKey || adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(403).json({ message: 'Invalid admin key' });
  }

  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    return res.status(400).json({ message: 'Email already registered as admin' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      isAdmin: true
    }
  });

  const token = generateToken(admin);

  res.status(201).json({
    token,
    admin: {
      id: admin.id,
      email: admin.email,
      isAdmin: true
    }
  });
});

exports.adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await prisma.admin.findUnique({ where: { email } });
  if (!admin) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(admin);

  res.json({
    token,
    admin: {
      id: admin.id,
      email: admin.email
    }
  });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = generateToken(user);

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      address: user.address,
      isAdmin: user.isAdmin
    }
  });
});

exports.logout = asyncHandler(async (req, res) => {
  res.json({
    message: 'Logged out successfully',
    instruction: 'Please remove the token from your client storage'
  });
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  // First try to find admin
  const admin = await prisma.admin.findUnique({
    where: { id: req.user.id }
  });

  if (admin) {
    return res.json({
      id: admin.id,
      email: admin.email,
      isAdmin: true
    });
  }

  // If not admin, try user
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      isAdmin: true
    }
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});