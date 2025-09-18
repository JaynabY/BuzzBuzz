const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Patient = require('../models/Patient');
const MedicalReport = require('../models/MedicalReport');
const Prescription = require('../models/Prescription');

// Get all doctors (for admin)
const getAllDoctors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const doctors = await Doctor.find()
      .populate('user', 'firstName lastName email phone isActive')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Doctor.countDocuments();

    res.json({
      success: true,
      data: {
        doctors,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalDoctors: total,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctors',
      error: error.message
    });
  }
};

// Get doctor details
const getDoctorDetails = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const doctor = await Doctor.findById(doctorId)
      .populate('user', 'firstName lastName email phone dateOfBirth gender address isActive');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      data: doctor
    });
  } catch (error) {
    console.error('Get doctor details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor details',
      error: error.message
    });
  }
};

// Update doctor profile (admin only)
const updateDoctorProfile = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const updates = req.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Separate user updates from doctor updates
    const userUpdates = {};
    const doctorUpdates = {};

    const userFields = ['firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender', 'address', 'isActive'];
    const doctorFields = ['specialization', 'licenseNumber', 'yearsOfExperience', 'education', 'certifications', 'department', 'schedule', 'consultationFee', 'bio', 'languages', 'isVerified'];

    Object.keys(updates).forEach(key => {
      if (userFields.includes(key)) {
        userUpdates[key] = updates[key];
      } else if (doctorFields.includes(key)) {
        doctorUpdates[key] = updates[key];
      }
    });

    // Update user profile if there are user updates
    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(doctor.user, userUpdates, { new: true, runValidators: true });
    }

    // Update doctor profile if there are doctor updates
    if (Object.keys(doctorUpdates).length > 0) {
      Object.assign(doctor, doctorUpdates);
      await doctor.save();
    }

    // Get updated doctor with populated user
    const updatedDoctor = await Doctor.findById(doctorId)
      .populate('user', 'firstName lastName email phone dateOfBirth gender address isActive');

    res.json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update doctor profile',
      error: error.message
    });
  }
};

// Get doctor's patients
const getDoctorPatients = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get patients who have been treated by this doctor
    const reportPatients = await MedicalReport.find({ doctor: doctorId })
      .distinct('patient');

    const patients = await Patient.find({ _id: { $in: reportPatients } })
      .populate('user', 'firstName lastName email phone dateOfBirth')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = reportPatients.length;

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
    console.error('Get doctor patients error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get doctor patients',
      error: error.message
    });
  }
};

// Search doctors
const searchDoctors = async (req, res) => {
  try {
    const { query, specialization, department } = req.query;
    
    let searchCriteria = {};
    
    if (specialization) {
      searchCriteria.specialization = { $regex: specialization, $options: 'i' };
    }
    
    if (department) {
      searchCriteria.department = { $regex: department, $options: 'i' };
    }

    let doctors = await Doctor.find(searchCriteria)
      .populate('user', 'firstName lastName email phone')
      .limit(20);

    // If there's a name query, filter by doctor's name
    if (query) {
      doctors = doctors.filter(doctor => 
        doctor.user.firstName.toLowerCase().includes(query.toLowerCase()) ||
        doctor.user.lastName.toLowerCase().includes(query.toLowerCase())
      );
    }

    res.json({
      success: true,
      data: doctors
    });
  } catch (error) {
    console.error('Search doctors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search doctors',
      error: error.message
    });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorDetails,
  updateDoctorProfile,
  getDoctorPatients,
  searchDoctors
};