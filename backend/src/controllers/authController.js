import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import redisClient from '../config/redis.js';
import {Admin, User} from "../models/model.js";
import {sendOTP, verifyOTP} from "./otpController.js";

dotenv.config();

const JWT_EXPIRES_IN = '1d';

const generateToken = (user) => {
    return jwt.sign(
        {id: user.id, email: user.email, isAdmin: user.isAdmin},
        process.env.JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
    );
};

export const signUp = async (req, res) => {
    const {name, email, password} = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('All fields are required.');
    }

    try {
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).send('User already exists. Please sign in.');
        }

        const otpToken = await sendOTP(email);
        const tempUserData = JSON.stringify({name, email, password});

        await redisClient.setEx(`signup:${otpToken}`, 300, tempUserData);

        return res.status(200).json({otpToken, message: 'OTP sent to your email. Please verify.'});
    } catch (err) {
        console.error('Sign-up error:', err);
        res.status(500).send('Server error during sign-up.');
    }
};

// OTP verification
export const completeSignUp = async (req, res) => {
    const {otpToken, otp} = req.body;

    if (!otpToken || !otp) {
        return res.status(400).json({message: 'Token and OTP are required.'});
    }

    try {

        const otpVerificationResult = await verifyOTP(otpToken, otp);

        if (!otpVerificationResult.success) {

            const userDataStr = await redisClient.get(`signup:${otpToken}`);
            if (!userDataStr) {
                return res.status(400).json({message: 'Token expired or not found.'});
            }

            const {name, email, password} = JSON.parse(userDataStr);
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = new User({name, email, password: hashedPassword, isAdmin: false});
            await user.save();

            await redisClient.del(`signup:${otpToken}`);

            const token = generateToken(user);
            res.status(201).json({token, message: 'User signed up successfully.'});
        } else {
            // OTP verification failed
            res.status(400).json({message: otpVerificationResult.message});
        }
    } catch (err) {
        console.error('Sign-up error:', err);
    }
};

export const signIn = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).send('User not found.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials.');
        }

        const token = generateToken(user);
        res.json({token, name: user.name});
    } catch (err) {
        console.error('Sign-in error:', err);
        res.status(500).send('Server error during sign-in.');
    }
};

export const adminLogin = async (req, res) => {
    const {email, password} = req.body;

    const admin = await Admin.findOne({email});
    if (!admin) {
        return res.status(401).json({message: 'Invalid credentials'});
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
        return res.status(401).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign(
        {id: admin.id, email: admin.email, isAdmin: true},
        process.env.JWT_SECRET,
        {expiresIn: JWT_EXPIRES_IN}
    )

    res.json({
        token,
        admin: {
            id: admin._id,
            email: admin.email
        }
    });
};