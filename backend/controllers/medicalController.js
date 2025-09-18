const MedicalReport = require('../models/MedicalReport');
const Prescription = require('../models/Prescription');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Get my medical reports (for patients)
const getMyReports = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find patient record for current user
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const reports = await MedicalReport.find({ patient: patient._id })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        },
        select: 'specialization department'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MedicalReport.countDocuments({ patient: patient._id });

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalReports: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get my reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get medical reports',
      error: error.message
    });
  }
};

// Get my prescriptions (for patients)
const getMyPrescriptions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find patient record for current user
    const patient = await Patient.findOne({ user: req.user._id });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient profile not found'
      });
    }

    const prescriptions = await Prescription.find({ patient: patient._id })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        },
        select: 'specialization department'
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Prescription.countDocuments({ patient: patient._id });

    res.json({
      success: true,
      data: {
        prescriptions,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPrescriptions: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get my prescriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prescriptions',
      error: error.message
    });
  }
};

// Create medical report (for doctors)
const createMedicalReport = async (req, res) => {
  try {
    // Find doctor record for current user
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const reportData = {
      ...req.body,
      doctor: doctor._id
    };

    const report = new MedicalReport(reportData);
    await report.save();

    const populatedReport = await MedicalReport.findById(report._id)
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Medical report created successfully',
      data: populatedReport
    });
  } catch (error) {
    console.error('Create medical report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create medical report',
      error: error.message
    });
  }
};

// Create prescription (for doctors)
const createPrescription = async (req, res) => {
  try {
    // Find doctor record for current user
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found'
      });
    }

    const prescriptionData = {
      ...req.body,
      doctor: doctor._id,
      validUntil: req.body.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };

    const prescription = new Prescription(prescriptionData);
    await prescription.save();

    const populatedPrescription = await Prescription.findById(prescription._id)
      .populate('patient')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Prescription created successfully',
      data: populatedPrescription
    });
  } catch (error) {
    console.error('Create prescription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create prescription',
      error: error.message
    });
  }
};

// Get medical report details
const getReportDetails = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await MedicalReport.findById(reportId)
      .populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'firstName lastName email dateOfBirth gender'
        }
      })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        },
        select: 'specialization department'
      });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Medical report not found'
      });
    }

    // Check permissions
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || !report.patient._id.equals(patient._id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || !report.doctor._id.equals(doctor._id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Get report details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get report details',
      error: error.message
    });
  }
};

// Get prescription details
const getPrescriptionDetails = async (req, res) => {
  try {
    const { prescriptionId } = req.params;

    const prescription = await Prescription.findById(prescriptionId)
      .populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'firstName lastName email dateOfBirth'
        }
      })
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'firstName lastName'
        },
        select: 'specialization department'
      });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: 'Prescription not found'
      });
    }

    // Check permissions
    if (req.user.role === 'patient') {
      const patient = await Patient.findOne({ user: req.user._id });
      if (!patient || !prescription.patient._id.equals(patient._id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor || !prescription.doctor._id.equals(doctor._id)) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: prescription
    });
  } catch (error) {
    console.error('Get prescription details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get prescription details',
      error: error.message
    });
  }
};

module.exports = {
  getMyReports,
  getMyPrescriptions,
  createMedicalReport,
  createPrescription,
  getReportDetails,
  getPrescriptionDetails
};