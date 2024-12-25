import asyncHandler from "express-async-handler";
import ApiError from '../utils/apiError.js';
import employeesModel from "../models/employeesModel.js";
import departmentModel from "../models/departmentModel.js";

//@desc POST employee
//@route Get /api/v1/create
//@access private
export const createEmployee = asyncHandler(async (req, res, next) => {

  const employee = await employeesModel.create(req.body);
  res.status(201).json({
    status: "Success",
    msg: "Employe add succesfully",
    data: employee
  });

});

//@desc GET employees
//@route Get /api/v1/Employees
//@access private

export const getEmployees = asyncHandler(async (req, res, next) => {
  const employees = await employeesModel.find({});
  res.json({
    status: "Success",
    data: employees
  });
});

//@desc GET employee by id
//@route Get /api/v1/Employee/:id
//@access private
export const getEmployee = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const employee = await employeesModel.findById(id).populate('department', 'name -_id');
  if (!employee) {
    return next(new ApiError('Employee not found', 404));
  }
  res.json({
    status: "Success",
    data: employee
  });
});

//@desc PUT employee by id
//@route Get /api/v1/Employee/:id
//@access private
export const updateEmployee = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const employee = await employeesModel.findByIdAndUpdate(id, {
    name: req.body.name,
    phone: req.body.phone,
    age: req.body.age,
    salary: req.body.salary
  }, { new: true });
  
  if (!employee) {
    return next(new ApiError('Employee not found', 404));
  }
  res.json({
    status: "Success",
    data: employee
  });
});

//@desc DELETE employee by id
//@route Get /api/v1/Employee/:id
//@access private
export const deleteEmployee = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const employee = await employeesModel.findByIdAndDelete(id);
  if (!employee) {
    return next(new ApiError('Employee not found', 404));
  }
  res.json({
    status: "delete employee Success",
  });
});

//@desc Add a employee to the specified department
export const addEmployeeToDepartment = asyncHandler(async (req, res, next) => {
  const { departmentId } = req.params;
  const { employeeId } = req.body;
  //1 check if the department exists
  const department = await departmentModel.findById(departmentId);
  if (!department) {
    return next(new ApiError('Department not found', 404));
  }
  //2 check if the employee exists
  const employee = await employeesModel.findById(employeeId);
  if (!employee) {
    return next(new ApiError('Employee not found', 404));
  };
  //3 check if the employee is exist in the department
  if (department.employees.includes(employeeId)) {
    return next(new ApiError('Employee already in the department', 400));
  }
  //4 // Add the employee to the department's employee list
  department.employees.push(employeeId);
  employee.department = department
  //5// Save the updated department
  await Promise.all([department.save(), employee.save()]);
  res.status(200).json({
    status: "Success",
    msg: "Employee added to department",
    data: department
  })
})

