import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./utils/prisma.js";
import otpRoutes from "./routes/otpRoutes.js";
import { connectRedis } from "./config/redis.js";
import plantRoutes from "./routes/PlantRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import newsletterRoutes from "./routes/newLetterRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import authRoutes from "./routes/authRoutes.js";


// Load environment variables
const env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

// Initialize Express app
const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Database Connection
await connectDB();
await connectRedis();

// Routes
app.use("/auth", authRoutes);
app.use("/otp", otpRoutes);
app.use("/plants", plantRoutes);
app.use("/category", categoryRoutes);
app.use("/blogs", blogRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/cart", cartRoutes);
app.use("/address", addressRoutes);
app.use("/payments", paymentRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
