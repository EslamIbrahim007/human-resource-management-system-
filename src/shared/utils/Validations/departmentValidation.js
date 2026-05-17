import { check } from "express-validator"
import validatorMiddleware from "../../Middleware/validatorMiddleware.js"
import DepartmentsModel from "../../models/departmentModel.js";


export const getDepartmentValidator = [
  check('id').isMongoId().withMessage("Invalid Department id"),
  validatorMiddleware
];
export const createDepartmentValidator = [
  check('name')
    .notEmpty().withMessage('Department name is required').custom((value) => DepartmentsModel.findOne({ name: value }).then((emp) => {
      if (emp) {
        return Promise.reject(new Error('This Department is already existed'))
      }
    })),
  check('description')
    .notEmpty().withMessage('Department description is required'),
  check('location')
    .notEmpty().withMessage('phone is required'),
  validatorMiddleware
];

export const updateDepartmentValidator = [
  check("id").isMongoId().withMessage("Invalid Department id"),
  check('name')
    .optional()
    .notEmpty().withMessage('Department name is required')
    .custom((value) => DepartmentsModel.findOne({ name: value }).then((emp) => {
      if (emp) {
        return Promise.reject(new Error('This Department is already existed'))
      }
    })),
  check('description')
    .optional()
    .notEmpty().withMessage('Department description is required')
  ,
  check('location')
    .optional()
    .notEmpty().withMessage('phone is required'),
  
  validatorMiddleware
];

export const deleteDepartmentValidator = [
  check('id').isMongoId().withMessage("Invalid Department id"),
  validatorMiddleware
];