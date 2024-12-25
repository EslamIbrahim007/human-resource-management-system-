import express from "express";
const route = express.Router();

import { protect, allowTo } from '../controller/authController.js';
import { recordAttendance } from '../controller/attendanceController.js';

// Define my routes here
route.post('/:status', protect, recordAttendance)
//route.post('/check-out', protect)

export default route