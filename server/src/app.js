require('dotenv').config();
// . rest of your code
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const rateLimiter = require('./middleware/rateLimiter');
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');

const app = express();

// Connect to MongoDB
connectDB();

// Connect to Redis
connectRedis();

// Middleware
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());
app.use(rateLimiter);

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(require('morgan')('combined', { stream: logger.stream }));
}

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/writerbot', require('./routes/writerBot'));

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;