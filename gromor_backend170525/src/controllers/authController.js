//Controller/admin + users
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require("../utils/prismaImport.js");
require('dotenv').config();
const asyncHandler = require('../utils/asyncHandler');


const JWT_EXPIRES_IN = '1d';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, isAdmin: user.isAdmin},
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
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