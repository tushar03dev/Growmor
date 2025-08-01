import transporter from '../config/nodemailerConfig.js';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

// Generate and send OTP
export const sendOTP = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Growmor verification OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    return otp;
};

export const passwordResetMail = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP via email
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Growmor Password Recovery OTP Code',
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
    });

    return otp;
};
