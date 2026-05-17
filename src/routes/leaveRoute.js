import express from 'express';
const route = express.Router();

import { submitALeaveApplication, updateLeaveApplication, LeaveBalance, LeaveHistory } from '../controller/leaveController.js'
import { leaveValidation } from "../utils/Validations/leaveValidation.js";
import { protect, allowTo } from '../controller/authController.js';

// submitALeaveApplication
route.post('/apply', protect ,leaveValidation, submitALeaveApplication)

//  update the applicationStatus status.
route.put('/update-leave-status/:id', protect ,allowTo('HR'), updateLeaveApplication);

// view the empolyee leave balance
route.get('/myBalance/:id', protect,allowTo('HR', 'Employee'), LeaveBalance);

// view employee leave balance
route.get('/leave-history/:id', protect ,allowTo('HR', 'Employee'), LeaveHistory)

export default route
