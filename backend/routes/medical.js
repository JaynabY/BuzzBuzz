const express = require('express');
const router = express.Router();
const { 
  getMyReports, 
  getMyPrescriptions, 
  createMedicalReport, 
  createPrescription, 
  getReportDetails, 
  getPrescriptionDetails 
} = require('../controllers/medicalController');
const { authenticate, isPatient, isDoctor, isDoctorOrAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Patient routes
router.get('/my-reports', isPatient, getMyReports);
router.get('/my-prescriptions', isPatient, getMyPrescriptions);

// Doctor routes
router.post('/reports', isDoctor, createMedicalReport);
router.post('/prescriptions', isDoctor, createPrescription);

// Shared routes (with permission checks in controller)
router.get('/reports/:reportId', getReportDetails);
router.get('/prescriptions/:prescriptionId', getPrescriptionDetails);

module.exports = router;