import express from "express";

const route = express.Router();
import {
  createEmployeeValidator,
  getemployeeValidator,
  updateEmployeeValidator,
  deleteEmployeeValidator
} from "../utils/Validations/employeeValidation.js"
import {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  addEmployeeToDepartment
} from "../controller/employeCont.js";

import { protect, allowTo } from "../controller/authController.js"

//route.use(protect)
// Define my routes here
route.post(
  '/create',
  createEmployeeValidator,
  createEmployee);

route.get('/employees', protect, allowTo("HR"),getEmployees);

// Add routes for other operations like getting employee by id, updating employee, and deleting employee.
route.get('/employee/:id',
  protect, allowTo("HR"),
  getemployeeValidator,
  getEmployee);

route.put('/employee/:id',
  protect, allowTo("HR"),
  updateEmployeeValidator,
  updateEmployee);

route.delete('/employee/:id',
  protect, allowTo("HR"),
  deleteEmployeeValidator,
  deleteEmployee);

route.patch('/add-employee/:departmentId', allowTo("HR"), addEmployeeToDepartment)
export default route