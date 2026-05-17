import asyncHandler from "express-async-handler";
import employeesModel from "../models/employeesModel.js";
import leaveModel from "../models/leaveModel.js";
import ApiError from '../utils/apiError.js';
import moment from 'moment';
import sendEmail from "../utils/sendEmail.js";

// @desc submit a leave application.
//@route Get /api/v1/apply-leave
//@access public
export const submitALeaveApplication = asyncHandler(async (req, res, next) => {
  const { startDate, endDate, reason, reasonInDetails } = req.body;

  // Validate and parse dates
  const start = moment(startDate, 'DD/MM/YYYY', true).startOf('day');
  const end = moment(endDate, 'DD/MM/YYYY', true).endOf('day');

  // Convert to UTC JavaScript Date objects
  const startJSDate = start.toDate();
  const endJSDate = end.toDate();

  // Check if the employee exists
  const employee = await employeesModel.findById(req.emp._id);
  if (!employee) {
    return next(new ApiError('Employee not found', 404));
  }

  // Check leave balance
  const leaveBalance = employee.leaveBalance;
  const leaveDays = Math.ceil((endJSDate - startJSDate) / (1000 * 60 * 60 * 24)) + 1;

  if (leaveDays > leaveBalance) {
    return next(new ApiError('Insufficient leave balance.', 400));
  }

  // Check for overlapping leave applications
  const existingLeaveApplications = await leaveModel.find({
    employeeId: req.emp._id,
    $or: [
      {
        $and: [
          { 'leaveApplication.startDate': { $lte: endJSDate } },
          { 'leaveApplication.endDate': { $gte: startJSDate } },
        ],
      },
    ],
  });

  if (existingLeaveApplications.length > 0) {
    return next(new ApiError('Leave application already exists for the given dates.', 400));
  }
  // Send email to HR for approval
  await sendEmail({
    from: employee.email,
    to: process.env.EMAIL,
    subject: 'Leave Application Submitted',
    text: `New leave application submitted by ${employee.firstName} ${employee.lastName}.\nStart Date: ${start.toLocaleString('en-US')}\nEnd Date: ${end.toLocaleString('en-US')}\nReason: ${reason}\nReason in Details: ${reasonInDetails}`,
  });

  // Create new leave application
  const newLeaveApplication = await leaveModel.create({
    employeeId: req.emp._id,
    leaveApplication: [{
      startDate: startJSDate,
      endDate: endJSDate,
      reason,
      reasonInDetails,
    }],
  });

  res.status(201).json({ message: 'Leave application submitted and email send.', newLeaveApplication });
});


// @desc update a leave application.
//@route Get /api/v1/update-leave-status
//@access private
export const updateLeaveApplication = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const { id } = req.params;

  // 1. Check if the application exists and retrieve the specific leave application
  const leaveDocument = await leaveModel.findOneAndUpdate(
    { "leaveApplication._id": id },
    { $set: { "leaveApplication.$.applicationStatus": status } },
    { new: true }
  );

  if (!leaveDocument) {
    return next(new ApiError('Leave application not found', 404));
  }

  // Find the specific leave application
  const leaveApplication = leaveDocument.leaveApplication.id(id);

  // 2. Check if the status is valid
  const validStatuses = ['Approved', 'Rejected'];
  if (!validStatuses.includes(status)) {
    return next(new ApiError('Invalid status', 400));
  }

  // 3. Deduct leave balance if approved
  if (status === 'Approved') {
    const start = new Date(leaveApplication.startDate);
    const end = new Date(leaveApplication.endDate);

    const employee = await employeesModel.findById(req.emp._id);
    const leaveDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    console.log('Leave Days:', leaveDays);

    if (leaveDays > employee.leaveBalance) {
      return next(new ApiError('Insufficient leave balance.', 400));
    }

    employee.leaveBalance -= leaveDays;
    await employee.save();

    // Send email to employee about leave application status
    try {
      await sendEmail({
        from: process.env.EMAIL,
        to: employee.email,
        subject: 'Leave Application Reply',
        text: `Your leave request has been ${status}.`,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return next(new ApiError('Failed to send email notification', 500));
    }
  }

  res.status(200).json({
    status: 'success',
    message: `Leave request ${status.toLowerCase()}.`,
    data: leaveApplication
  });
});


// @desc  Employees can check their remaining leave balance.
//@route Get /api/v1/myBalance
//@access private empolyee/Hr
export const LeaveBalance = asyncHandler(async (req, res, next) => {
  // check if the empolyee exist
  const employee = await employeesModel.findById(req.emp._id);
  if (!employee) {
    return next(new ApiError('Employee not found', 404));
  };
  // return the leave balance
  res.json({ message: `Your leave balance is: ${employee.leaveBalance}`, leaveBalance: employee.leaveBalance });
});

// @desc  Employees can check their history leave .
//@route Get /api/v1/leave-history
//@access private empolyee/Hr
export const LeaveHistory = asyncHandler(async (req, res, next) => {
  // check if the empolyee exist
  const employeeLeaveHistory = await leaveModel.find({ employeeId: req.params.id });
  if (!employeeLeaveHistory) {
    return next(new ApiError('History not found', 404));
  };
  // return the leave balance
  res.json({ message: `Your leave History is:`, history: employeeLeaveHistory });
})