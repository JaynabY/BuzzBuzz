const express = require('express');
const router = express.Router();
const { 
  getAllPatients, 
  getPatientDetails, 
  getPatientMedicalHistory, 
  getPatientPrescriptions, 
  searchPatients 
} = require('../controllers/patientController');
const { authenticate, isDoctorOrAdmin } = require('../middleware/auth');

// All routes require authentication and doctor/admin role
router.use(authenticate);
router.use(isDoctorOrAdmin);

// Patient routes for doctors and admins
router.get('/', getAllPatients);
router.get('/search', searchPatients);
router.get('/:patientId', getPatientDetails);
router.get('/:patientId/medical-history', getPatientMedicalHistory);
router.get('/:patientId/prescriptions', getPatientPrescriptions);

module.exports = router;