
import asyncHandler from 'express-async-handler';
import attendanceModel from '../models/attendanceModel.js';
import ApiError from '../utils/apiError.js'; // Assuming you have an ApiError class defined

// @desc attendance
////@route Get /api/v1/:status
// //@access Public

export const recordAttendance = asyncHandler(async (req, res, next) => {
  const { status } = req.params; // status should be 'Check-in' or 'Check-out'
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD format

  // Check if attendance record exists for the current employee and today's date
  // Find today's attendance record

  let attendance = await attendanceModel.findOne({
    employeeId: req.emp._id,
    'attendanceRecords.timestamp': {
      $gte: new Date(today),
      $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000) // End of the day
    }
  });

  // check if the last record is a check-out or if 24h have passed since the last check-in
  if (attendance && attendance.attendanceRecords.length > 0) {
    // `attendance` is not null or undefined and contains records for today
    // Retrieve the most recent check-in or check-out record from today's records
    const lastRecord = attendance.attendanceRecords[attendance.attendanceRecords.length - 1];

    // Only apply the check-in restriction logic
    // check if the employee trying to check-in again within 24 without check-out
    if (status === 'Check-in') {
      if (lastRecord.status === 'Check-in') {
        const lastCheckInTime = new Date(lastRecord.timestamp);
        const currentTime = new Date();
        const timeDiff = (currentTime - lastCheckInTime) / (1000 * 60 * 60); // Time difference in hours

        // If less than 24 hours, return an error

        if (timeDiff < 24) {
          console.log('Error: Trying to check-in again within 24 hours');
          return next(new ApiError('You cannot check-in again before 24 hours have passed since the last check-in.', 400));
        }
      }
    }
  }

  // If no attendance record exists for today, create a new one
  if (!attendance) {
    attendance = await attendanceModel.create({
      employeeId: req.emp._id,
      date: new Date(),
      attendanceRecords: [{ status, timestamp: new Date() }]
    });
  } else {
    attendance.attendanceRecords.push({ status, timestamp: new Date() });
    await attendance.save();
  }

  res.status(201).json({ status: 'Success', data: attendance });
});





























