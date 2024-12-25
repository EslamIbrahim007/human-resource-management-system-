import { check } from "express-validator"
import validatorMiddleware from "../../Middleware/validatorMiddleware.js"
import employeesModel from "../../models/employeesModel.js";


export const getemployeeValidator = [
  check('id').isMongoId().withMessage("Invalid User id"),
  validatorMiddleware
];
export const createEmployeeValidator = [
  check('firstName')
    .notEmpty().withMessage('First name is required')
    .isLength({ min: 3 }).withMessage("Too short for  name")
    .isLength({ max: 32 }).withMessage("Too long for  name"),
  check('lastName')
    .notEmpty().withMessage('Last name is required')
    .isLength({ min: 3 }).withMessage("Too short for  name")
    .isLength({ max: 32 }).withMessage("Too long for  name"),
  check('email')
    .notEmpty().withMessage('E-mail is required')
    .isEmail().withMessage('Please enter a valid email address')
    .custom((value) => employeesModel.findOne({ email: value }).then((emp) => {
      if (emp) {
        return Promise.reject(new Error('This email is already existed'))
      }
    })),
  check('phone')
    .notEmpty().withMessage('phone is required')
    .isMobilePhone().withMessage('Please enter a valid phone number'),
  check('salary').isFloat({ gt: 0 }).withMessage('Salary must be a positive number'),

  validatorMiddleware
];

export const updateEmployeeValidator = [
  check("id").isMongoId().withMessage("Invalid Employee id"),
  check('firstName')
    .optional()
    .notEmpty().withMessage('First name is required'),
  check('lastName')
    .optional()
    .notEmpty().withMessage('Last name is required'),
  check('email')
    .optional()
    .notEmpty().withMessage('E-mail is required')
    .isEmail().withMessage('Please enter a valid email address')
    .custom((value) => employeesModel.findOne({ email: value }).then((emp) => {
      if (emp) {
        return Promise.reject(new Error('This email is already existed'))
      }
    })),
  check('phone')
    .optional()
    .notEmpty().withMessage('phone is required')
    .isMobilePhone().withMessage('Please enter a valid phone number'),
  check('salary')
    .optional()
    .isFloat({ gt: 0 }).withMessage('Salary must be a positive number'),
  
  validatorMiddleware
];

export const deleteEmployeeValidator = [
  check('id').isMongoId().withMessage("Invalid Employee id"),
  validatorMiddleware
];