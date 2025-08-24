import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./config/db.js";
import otpRoutes from "./routes/otpRoutes.js";
import {connectRedis} from "./config/redis.js";
import bodyParser from 'body-parser'
import morgan from 'morgan';

// Load environment variables
const env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

// Initialize Express app
const app = express();

app.use(morgan('dev'));

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database Connection
connectDB().then(
    await connectRedis()
        .then( async() => {
              const authRoutes = (await import('./routes/authRoutes.js')).default;
              app.use('/auth', authRoutes);
            }
        )
);

// Routes
app.use("/otp", otpRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 