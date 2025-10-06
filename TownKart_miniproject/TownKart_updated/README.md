# TownKart - Unified E-commerce Platform

A full-stack e-commerce platform with unified login for customers, business owners, and administrators.

## Features

- **Unified Login System**: Single login page with role selection (Customer, Business Owner, Admin)
- **Role-based Access Control**: Different dashboards and permissions based on user role
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion
- **Secure Backend**: Node.js, Express.js, MongoDB with JWT authentication
- **Real-time Updates**: Hot reloading for both frontend and backend

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Installation & Setup

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/townkart
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CLIENT_URL=http://localhost:5173
   RATE_LIMIT_WINDOW=15
   RATE_LIMIT_MAX_REQUESTS=100
   ```

3. **Seed demo users:**
   ```bash
   npm run seed
   ```

4. **Start both frontend and backend:**
   ```bash
   npm start
   ```

That's it! The application will be running at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## Demo Credentials

After running the seed command, you can use these credentials:

- **Customer**: `customer@test.com` / `password`
- **Admin**: `admin@test.com` / `password`
- **Business Owner**: `business@test.com` / `password`

## Project Structure

```
TownKart_updated/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React contexts
│   │   └── layouts/         # Layout components
├── backend/                 # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── server.js           # Main server file
└── package.json            # Root package with scripts
```

## Available Scripts

- `npm start` - Start both frontend and backend
- `npm run dev` - Start both frontend and backend in development mode
- `npm run install:all` - Install dependencies for both frontend and backend
- `npm run seed` - Seed demo users to the database

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Health Check
- `GET /api/health` - API health status

## Technologies Used

### Frontend
- React 18
- React Router DOM
- Tailwind CSS
- Framer Motion
- React Hot Toast
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing
- CORS, Helmet, Rate Limiting

## Development

The application uses hot reloading for both frontend and backend. Any changes you make will automatically refresh the application.

## Production Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Update `JWT_SECRET` to a secure random string
3. Configure your MongoDB connection string
4. Build the frontend: `npm --prefix frontend run build`
5. Start the backend: `npm --prefix backend start`



