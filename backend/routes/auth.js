const express = require('express');
const router = express.Router();
const { register, login, getProfile, registerValidation, loginValidation } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

// Public routes
router.post('/register', registerValidation, handleValidationErrors, register);
router.post('/login', loginValidation, handleValidationErrors, login);

// Protected routes
router.get('/profile', authenticate, getProfile);

module.exports = router;