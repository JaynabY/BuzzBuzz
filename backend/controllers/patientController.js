const Patient = require('../models/Patient');
const User = require('../models/User');
const MedicalReport = require('../models/MedicalReport');
const Prescription = require('../models/Prescription');

// Get all patients (for doctors and admins)
const getAllPatients = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const patients = await Patient.find()
      .populate('user', 'firstName lastName email phone dateOfBirth gender')
      .populate('primaryDoctor', 'specialization')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Patient.countDocuments();

    res.json({
      success: true,
      data: {
        patients,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPatients: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patients',
      error: error.message
    });
  }
};

// Get patient details
const getPatientDetails = async (req, res) => {
  try {
    const { patientId } = req.params;

    const patient = await Patient.findById(patientId)
      .populate('user', 'firstName lastName email phone dateOfBirth gender address')
      .populate('primaryDoctor', 'specialization department');

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    res.json({
      success: true,
      data: patient
    });
  } catch (error) {
    console.error('Get patient details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient details',
      error: error.message
    });
  }
};

// Get patient medical history
const getPatientMedicalHistory = async (req, res) => {
  try {
    const { patientId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get medical reports
    const reports = await MedicalReport.find({ patient: patientId })
      .populate('doctor', 'specialization department')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalReports = await MedicalReport.countDocuments({ patient: patientId });

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalReports / limit),
          totalReports,
          hasNextPage: page < Math.ceil(totalReports / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get patient medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient medical history',
      error: error.message
    });
  }
};

// Get patient prescriptions
const getPatientPrescriptions = async (req, res) => {
  try {
    const { patientId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get prescriptions
    const prescriptions = await Prescription.find({ patient: patientId })
      .populate('doctor', 'specialization department')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPrescriptions = await Prescription.countDocuments({ patient: patientId });

    res.json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalPrescriptions / limit),
          totalPrescriptions,
          hasNextPage: page < Math.ceil(totalPrescriptions / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get patient prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get patient prescriptions',
      error: error.message
    });
  }
};

// Search patients
const searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const patients = await Patient.find()
      .populate({
        path: 'user',
        match: {
          $or: [
            { firstName: { $regex: query, $options: 'i' } },
            { lastName: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        },
        select: 'firstName lastName email phone'
      })
      .limit(20);

    // Filter out patients where user match failed
    const filteredPatients = patients.filter(patient => patient.user);

    res.json({
      success: true,
      data: filteredPatients
    });
  } catch (error) {
    console.error('Search patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search patients',
      error: error.message
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientDetails,
  getPatientMedicalHistory,
  getPatientPrescriptions,
  searchPatients
};