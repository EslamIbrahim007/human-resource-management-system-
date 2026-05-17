import { Schema, model } from 'mongoose';

const leaveSchema = new Schema({
  // Basic leave Information
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  leaveApplication: [{
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, enum: ['Annual', "Casual", "Resign"], required: true },
    reasonInDetails: { type: String, required: true },
    applicationStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
    appliedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });


// Import the Employee model
const leaveModel = model('leave', leaveSchema);
export default leaveModel