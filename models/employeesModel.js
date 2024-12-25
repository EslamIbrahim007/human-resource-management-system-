import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';

// Import the Employee model

const employeeSchema = new Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
  },
  address: {
    street: { type: String },
    city: { type: String },
  },
  dateOfBirth: { type: Date },

  // Work Information
  
  dateOfJoining: {
    type: Date,
  },
  employmentStatus: {
    type: String,
    enum: ['Active', 'OnLeave', 'Terminated'],
    default: 'Active'
  },

  // Financial Information
  salary: { type: Number },
  bonuses: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  bankDetails: {
    bankName: { type: String },
    accountNumber: { type: String },
  },

  // Leave and Attendance
  leaveBalance: {
    type: Number,
    default:21
  },
  attendanceRecords: [
    {
      date: { type: Date },
      status: { type: String, enum: ['Present', 'Absent', 'On Leave'], default: 'Present' }
    }
  ],

  // Performance and Documents
  performanceReviews: [
    {
      date: { type: Date },
      reviewText: { type: String },
      rating: { type: Number, min: 1, max: 5 }
    }
  ],

  // Security
  password: { type: String, required: true },  // hashed password
  passwordChangedAt: Date,
  role: { type: String, enum: ['Employee', 'HR', 'Admin'], default: 'Employee' },
  department: {
    type: Schema.Types.ObjectId,
    ref: 'Department'
  }
}, {
  timestamps: true,
  
});

// Middleware to automatically populate the 'employees' field
// employeeSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'department',
//     select: 'name', // Only include specific fields
//   });
//   next();
// });


// Hash the password before saving it into the database
employeeSchema.pre("save", async function (next)  {
  if (!this.isModified("password")) {
    return next();
  }
  // hash this password 
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Export the Employee model
export default model("Employee", employeeSchema);