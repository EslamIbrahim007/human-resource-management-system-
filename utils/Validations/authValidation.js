import { check } from "express-validator"
import validatorMiddleware from "../../Middleware/validatorMiddleware.js"
import employeesModel from "../../models/employeesModel.js";



export const signUpValidator = [
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
  check("password")
    .notEmpty().withMessage("Your password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
    .custom((value, { req }) =>
    {
      console.log('Password:', value);
      console.log('Password Confirm:', req.body.passwordConfirm);
      if (value !== req.body.passwordConfirm) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  check("passwordConfirm").notEmpty().withMessage("Your password confirmation is required"),

  validatorMiddleware
];

export const logInValidator = [
  check('email')
    .notEmpty().withMessage('E-mail is required')
    .isEmail().withMessage('Please enter a valid email address'),
  check('password')
    .notEmpty()
    .withMessage("your password is required")
    .isLength({ min: 8 }).withMessage("password must be at least 8 characters."),
  validatorMiddleware
]