import express from "express";
const route = express.Router();

// Import necessary validators for Department CRUD operations.
import {
  getDepartmentValidator, createDepartmentValidator, updateDepartmentValidator, deleteDepartmentValidator
} from '../utils/Validations/departmentValidation.js'
// Import necessary controllers for Department CRUD operations.
import {
  createDepartment,
  getDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment
} from "../controller/departmentCont.js";

import { protect, allowTo } from '../controller/authController.js';

// Define my routes here
route.get('/departments', protect,
  allowTo("HR", "Admin"), getDepartments);

route.post(
  '/addDepartment',
  protect,
  allowTo("HR","Admin"),
  createDepartmentValidator,
  createDepartment);


// Add routes for other operations like getting Department by id, updating Department, and deleting Department.
route.get(
  '/department/:id',
  protect,
  allowTo("HR", "Admin"),
  getDepartmentValidator,
  getDepartment);

route.put(
  '/department/:id',
  protect,
  allowTo("HR", "Admin"),
  updateDepartmentValidator,
  updateDepartment);

route.delete(
  '/department/:id',
  protect,
  allowTo("HR", "Admin"),
  deleteDepartmentValidator,
  deleteDepartment);


export default route