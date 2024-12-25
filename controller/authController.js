import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto'
import ApiError from '../utils/apiError.js';

import employeeModel from '../models/employeesModel.js'

//@desc Sign Up
//@route POST /api/auth/signup
//@access Public

export const signUp = asyncHandler(async (req, res, next) => {
  //1 create a new employee
  const employee = await employeeModel.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role
  });

  //2 Generate JWT token
  const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });

  //3 Send response with token
  res.status(201).json({
    status: "success",
    token,
    data: {
      id: employee._id,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email
    }
  });
});


//@desc log in
//@route GET /api/auth/login
//@access Public

export const logIn = asyncHandler(async (req, res, next) => {
  //1 check if password and email are valid by validation
  //2 check if email exist 
  const employee = await employeeModel.findOne({
    email: req.body.email
  });
  if (!employee) { return next(new ApiError("Incorrect email or password", 404)); };
  //2 check if the pass word correct
  const comparePass = await bcrypt.compare(req.body.password, employee.password);
  if (!comparePass) {
    return next(new ApiError("Incorrect email or password", 404))
  };
  //3 Generate token again
  const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE_TIME });

  //3 Send response with token
  res.status(200).json({
    status: "success",
    token,
    data: {
      id: employee._id,
      name: `${employee.firstName} ${employee.lastName}`,
      email: employee.email
    }
  });
});

//@desc check if user is loged in or not
export const protect = asyncHandler(async (req, res, next) => {
  //1 check if token is there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  };
  if (!token) {
    return next(new ApiError("You are not logged in plz log in first ", 401))
  };

  //2 check if token is valid
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded);
  } catch (err) {
    return next(new ApiError("Invalid Token. Please log in again.", 401));
  }
  //3 check if this employee is existing
  const employee = await employeeModel.findById(decoded.id);
  if (!employee) {
    return next(new ApiError("this employee its not exist  ", 401))
  };
  if (employee.employmentStatus === "OnLeave") {
    return next(new ApiError("this employee is not longer existed in this company", 401));
  };
  //4) check if the user change his password
  if (employee.passwordChangedAt) {
    const passwordChangedToTimesStamp = parseInt(employee.passwordChangedAt.getTime() / 1000, 10);
    //password changed after token created (Error)
    if (passwordChangedToTimesStamp > decoded.iat) {
      return next(new ApiError("employee recently changed password. Please log in again ", 401));
    };
  };
  //if everything is fine
  req.emp = employee;
  next();
});

//@desc authorization (employee permissions)

export const allowTo = (...roles) => asyncHandler(async (req, res, next) => {
  // access the roles
  const employeeRole = req.emp.role;
  // check if the employee's role is allowed
  if (!roles.includes(employeeRole)) {
    return next(new ApiError("You are not allowed to perform this action", 403));
  };
  next();
});
