const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
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
  medicalReport: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalReport'
  },
  prescriptionId: {
    type: String,
    required: true,
    unique: true
  },
  medications: [{
    name: {
      type: String,
      required: true
    },
    genericName: String,
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    instructions: String,
    quantity: Number,
    refills: {
      type: Number,
      default: 0
    },
    isGenericAllowed: {
      type: Boolean,
      default: true
    }
  }],
  diagnosis: {
    type: String,
    required: true
  },
  instructions: {
    type: String,
    default: ''
  },
  validUntil: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled', 'expired'],
    default: 'active'
  },
  pharmacyNotes: String,
  isElectronic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate prescription ID
prescriptionSchema.pre('save', async function(next) {
  if (!this.prescriptionId) {
    const count = await mongoose.models.Prescription.countDocuments();
    this.prescriptionId = `RX${String(count + 1).padStart(8, '0')}`;
  }
  next();
});

// Index for efficient querying
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ status: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);