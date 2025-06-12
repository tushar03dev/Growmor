import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port : Number(process.env.PORT),
    secure: true,
    auth:{
        user: process.env.USER,
        pass: process.env.PASS
    }
});

export default transporter;