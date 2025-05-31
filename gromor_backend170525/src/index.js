const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./utils/prismaImport');
const errorHandler = require('./middlewares/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const blogRoutes = require('./routes/blogRoutes');
const cartRoutes = require('./routes/cartRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
// const orderRoutes = require('./routes/orderRoutes');
//const paymentRoutes = require('./routes/paymentRoutes');
const plantRoutes = require('./routes/PlantRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
const userRoutes = require('./routes/UserRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/categories', categoryRoutes);
// app.use('/api/orders', orderRoutes);
// //app.use('/api/payments', paymentRoutes);
app.use('/api/plants', plantRoutes);
// app.use('/api/reviews', reviewRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 