import departmentModel from "../models/departmentModel.js";
import asyncHandler from "express-async-handler";
import ApiError from '../utils/apiError.js';


//@desc POST demartment
//@route Get /api/v1/create
//@access private
export const createDepartment = asyncHandler(async (req, res, next) => {

  const department = await departmentModel.create(req.body);
  res.status(201).json({
    status: "Success",
    msg: "department add succesfully",
    data: department
  });

});

//@desc GET Departments
//@route Get /api/v1/Departments
//@access private

export const getDepartments = asyncHandler(async (req, res, next) => {
  const department = await departmentModel.find({});
  res.json({
    status: "Success",
    data: department
  });
});

//@desc GET Department by id
//@route Get /api/v1/Department/:id
//@access private
export const getDepartment = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const department = await departmentModel.findById(id).populate('employees', 'firstName lastName role -_id');
  if (!department) {
    return next(new ApiError('department not found', 404));
  }
  res.json({
    status: "Success",
    data: department
  });
});

//@desc PUT Department by id
//@route Get /api/v1/Department/:id
//@access private
export const updateDepartment = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const department= await departmentModel.findByIdAndUpdate(id, req.body, { new: true });
  
  if (!department) {
    return next(new ApiError('department not found', 404));
  }
  res.json({
    status: "Success",
    data: department
  });
});

//@desc DELETE Department by id
//@route Get /api/v1/Department/:id
//@access private
export const deleteDepartment = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const department = await departmentModel.findByIdAndDelete(id);
  if (!department) {
    return next(new ApiError('Department not found', 404));
  }
  res.json({
    status: "delete department Success",
  });
});

