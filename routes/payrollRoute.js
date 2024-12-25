import express from "express";
const router = express.Router();
import { protect, allowTo } from '../controller/authController.js';
import { createPayroll, createPaySlip, getEmployeePayroll } from "../controller/payrollController.js";

// Define my routes here

router.post('/employee/:employeeId', protect, allowTo("HR"), createPayroll);

router.get('/employee/:employeeId/:payrollId', protect, allowTo("HR"), getEmployeePayroll);

router.post('/:payrollId', protect, allowTo("HR") ,createPaySlip);
export default router