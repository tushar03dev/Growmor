# Growmor Plant Haven

A full-stack e-commerce platform for plants, built with React (Frontend) and Node.js (Backend).

## Project Structure

```
├── growmor-plant-haven/     # Frontend (React + TypeScript)
└── gromor_backend170525/    # Backend (Node.js + Express)
```

## Frontend (growmor-plant-haven)

### Tech Stack
- React
- TypeScript
- Tailwind CSS
- React Query
- Axios

### Setup
1. Navigate to frontend directory:
   ```bash
   cd growmor-plant-haven
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Backend (gromor_backend170525)

### Tech Stack
- Node.js
- Express
- Prisma
- PostgreSQL
- Cloudinary
- JWT Authentication

### Setup
1. Navigate to backend directory:
   ```bash
   cd gromor_backend170525
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create .env file:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/growmor_db"
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. Set up database:
   ```bash
   npx prisma migrate dev
   ```

5. Start development server:
   ```bash
   npm run dev
   ```

## Features

- User Authentication (JWT)
- Admin Dashboard
- Product Management
- Category Management
- Image Upload (Cloudinary)
- Shopping Cart
- Order Management
- Responsive Design

## API Endpoints

### Public Routes
- GET /api/plants - Get all plants
- GET /api/plants/:id - Get plant by ID
- GET /api/categories - Get all categories

### Admin Routes
- POST /api/plants - Create plant
- PUT /api/plants/:id - Update plant
- DELETE /api/plants/:id - Delete plant
- POST /api/categories - Create category
- PUT /api/categories/:id - Update category
- DELETE /api/categories/:id - Delete category

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 