const express = require('express');
const router = express.Router();
const { 
  getAllDoctors, 
  getDoctorDetails, 
  updateDoctorProfile, 
  getDoctorPatients, 
  searchDoctors 
} = require('../controllers/doctorController');
const { authenticate, isAdmin, isDoctorOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Public doctor routes (for all authenticated users)
router.get('/search', searchDoctors);

// Admin-only routes
router.get('/', isAdmin, getAllDoctors);
router.put('/:doctorId', isAdmin, updateDoctorProfile);

// Doctor and admin routes
router.get('/:doctorId', isDoctorOrAdmin, getDoctorDetails);
router.get('/:doctorId/patients', isDoctorOrAdmin, getDoctorPatients);

module.exports = router;