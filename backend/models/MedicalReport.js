const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  reportType: {
    type: String,
    required: true,
    enum: ['consultation', 'lab_test', 'imaging', 'procedure', 'emergency', 'follow_up']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  diagnosis: {
    primary: String,
    secondary: [String],
    icd10Codes: [String]
  },
  symptoms: [String],
  vitalSigns: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    respiratoryRate: Number,
    oxygenSaturation: Number,
    weight: Number,
    height: Number,
    bmi: Number
  },
  labResults: [{
    testName: String,
    result: String,
    normalRange: String,
    unit: String,
    isAbnormal: Boolean,
    notes: String
  }],
  treatmentPlan: {
    type: String,
    required: true
  },
  recommendations: [String],
  followUpDate: Date,
  attachments: [{
    fileName: String,
    fileUrl: String,
    fileType: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  isConfidential: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'finalized', 'amended'],
    default: 'finalized'
  }
}, {
  timestamps: true
});

// Index for efficient querying
medicalReportSchema.index({ patient: 1, createdAt: -1 });
medicalReportSchema.index({ doctor: 1, createdAt: -1 });

module.exports = mongoose.model('MedicalReport', medicalReportSchema);