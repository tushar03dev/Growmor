import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import otpRoutes from "./routes/otpRoutes.js";
import { connectRedis } from "./config/redis.js";
import bodyParser from "body-parser";
import plantRoutes from "./routes/PlantRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import newsletterRoutes from "./routes/newLetterRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";


// Load environment variables
const env = process.env.NODE_ENV;
dotenv.config({ path: `.env.${env}` });

// Initialize Express app
const app = express();

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Database Connection
connectDB().then(
  await connectRedis().then(async () => {
    const authRoutes = (await import("./routes/authRoutes.js")).default;
    app.use("/auth", authRoutes);
  })
);

// Routes
app.use("/otp", otpRoutes);
app.use("/plants", plantRoutes);
app.use("/category", categoryRoutes);
app.use("/blogs", blogRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/cart", cartRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
