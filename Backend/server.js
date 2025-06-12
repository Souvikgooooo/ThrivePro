require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./middlewares/error');
const connectDB=require("./config/db")
const app = express();

// Middleware
const allowedOrigins = [
  'https://thrive-pro-kappa.vercel.app', // Your Vercel frontend URL
  // Add other production origins here if needed
];

// Conditionally allow localhost for development
if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.push('http://localhost:5173'); // Frontend dev server
  allowedOrigins.push('http://localhost:3000'); // Another common frontend dev port
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow cookies to be sent
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/provider', require('./routes/providerRoutes'));
app.use('/api/customer', require('./routes/customerRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/service-requests', require('./routes/serviceRequestRoutes'));
app.use('/api', require('./routes/contactRoutes')); // New contact routes

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
(
    async () => {
        await connectDB();
        app.listen(PORT, () =>{ 

            console.log(`Server running on port ${PORT}`)
        });
    }
)();
