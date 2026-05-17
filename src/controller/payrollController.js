//1. Import necessary modules:
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import asyncHandler from "express-async-handler";
import payrollModel from '../models/PayrollModel.js';
import employeesModel from '../models/employeesModel.js';
import ApiError from '../utils/apiError.js';

import PDFDocument from 'pdfkit';

// Simulate __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//@desc POST payroll
//@route POST /api/v1/:employeeId/payroll
//@access private HR 

export const createPayroll = asyncHandler(async (req, res, next) => { 
  //1 check the premission did it allowto fun
  const { employeeId } = req.params;
  
  const { bonus, deductions }  = req.body;
  //2 check if employee exists
  const employee = await employeesModel.findById(employeeId);
  if (!employee) {
    return next(new ApiError('Employee not found', 404));
  };
  let totalSalary = employee.salary
  //3 Salary Calculation
  totalSalary += bonus - deductions
  //4 create a new payroll
  const payroll = await payrollModel.create({
    employee: employeeId,
    bonus,
    deductions,
    totalSalary: totalSalary
  });
  //5 save the payroll
  await payroll.save();
  //5 return the payroll
  res.json({
    status: "Success",
    data: payroll
  });

});
//@desc GET payroll
//@route POST /api/v1/:payrollId
//@access private HR 
export const getEmployeePayroll = asyncHandler(async (req, res, next) => {
  //1 check the premission did it allowto fun
  //2 check the if the payroll is existing
  const { employeeId, payrollId } = req.params;
  const payroll = await payrollModel.findById(payrollId).populate('employee', 'firstName lastName salary');
  if (!payroll) {
    return next(new ApiError('Payroll not found', 404));
  };
  // const employee = await employeesModel.findById(employeeId);
  // if (!employee) { 
  //   return next(new ApiError('Employee not found', 404));
  // }
  //2 check if the employee is the same as in the payroll
  if (payroll.employee._id.toString() != employeeId) {
    return next(new ApiError('Payroll not belong to this employee', 401));
  };
  //3 return the payroll
  res.json({
    status: "Success",
    data: payroll
  });
});

// @desc POST paySilp
///@route POST /api/v1/payroll/:payrollId
export const createPaySlip = asyncHandler(async (req, res, next) => { 
  //1 check the premission did it allowto fun
  //2 check the if the payroll is existing
  const { payrollId } = req.params;
  const payroll = await payrollModel.findById(payrollId).populate('employee', 'firstName lastName salary');
  console.log(payroll);
  
  if (!payroll) {
    return next(new ApiError('Payroll not found', 404));
  };
  //3 create a new payslib ;
  const doc = new PDFDocument();
  const filePath = path.resolve(__dirname, `../public/payslips/${payrollId}.pdf`);
  // Ensure public/payslips directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  doc.pipe(fs.createWriteStream(filePath));

  // Ensure all necessary fields are properly accessed
  doc.text(`Payslip for ${payroll.employee.firstName} ${payroll.employee.lastName}`, { align: "center" });
  doc.text(`Base Salary: ${payroll.employee.salary}`);
  doc.text(`Bonuses: ${payroll.bonus}`); doc.text(`Deductions: ${payroll.deductions}`);
  doc.text(`Total Salary: ${payroll.totalSalary}`);
  doc.end();

  // Update payroll with payslip URL
  payroll.payslipUrl = `/payslipd/${payrollId}.pdf`;
  await payroll.save();

  res.status(200).json({
    status: "Success/Payslip generated",
    data: payroll.payslipUrl
  });
}); 