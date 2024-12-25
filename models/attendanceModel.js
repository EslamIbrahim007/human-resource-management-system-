import { Schema, model } from 'mongoose';

const attendanceSchema = new Schema({
  // Basic Attendance Information
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  date: { type: Date, required: true },
  attendanceRecords: [
    {
      timestamp: { type: Date, default: Date.now },
      status: { type: String, enum: ['Check-in', 'Check-out'], required: true }
    }]

}, { timestamps: true });


// Import the Employee model
const attendanceModel = model('attendance', attendanceSchema);
export default attendanceModel