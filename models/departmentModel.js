import { Schema, model } from "mongoose";


const departmentSchema = new Schema({
  // Basic Department Information
  name: { type: String, required: true, unique: true }, // e.g., "Human Resources"
  description: { type: String },  // Brief description of the department's purpose

  location: {
    type: String,
    required: [true, 'the location is required'],
    minlength: 3,
    maxlength: 50,
  },
  // Head of Department
  head: {
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  },
  // Employees Count
  employeesCount: {
    type: Number,
    default: 0
  },// Keeps track of the number of employees in this department
  employees: [{
    type: Schema.Types.ObjectId,
    ref: 'Employee'
  }]
}, {
  timestamps: true,
  //to enable virtuals populate
  
});


export default model("Department", departmentSchema);