import jwt from "jsonwebtoken";
import transporter from "../config/nodemailerConfig.js";
import dotenv from "dotenv";

dotenv.config();

export const sendOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 90000).toString();

    const token = jwt.sign({otp}, process.env.JWT_SECRET, {expiresIn: '5m'});

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: 'Your Growmor verification OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    })

    return token;
}

export const verifyOTP = async (token, otp) => {
    try {
        if (!otp || !token) {
            return {success: false, message: 'Token and OTP are required'};
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.otp === otp) {
            return {success: true, message: 'OTP verified successfully'};
        } else {
            return {success: false, message: 'Invalid OTP'};
        }
    } catch (error) {
        return {success: false, message: 'Invalid or expired token'};
    }
}