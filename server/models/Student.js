const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID / Roll code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Student email is required'],
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      default: 'Computer Science & Engineering',
    },
    year: {
      type: Number,
      required: true,
      default: 3,
    },
    section: {
      type: String,
      required: true,
      default: 'A',
    },
    rollNumber: {
      type: String,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    faceDescriptor: {
      type: [Number], // Browser face embedding vector (e.g. 128 elements)
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for display roll label
studentSchema.virtual('fullLabel').get(function () {
  return `${this.name} (${this.studentId})`;
});

module.exports = mongoose.model('Student', studentSchema);
