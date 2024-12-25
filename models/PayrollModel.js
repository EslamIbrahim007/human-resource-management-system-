import { Schema, model } from "mongoose";

const payrollSchema = new Schema({
  // Basic payroll Information
  employee: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  employeeId: { type: Number },
  netSalary: { type: Number },
  bonus: { type: Number },
  deductions: { type: Number },
  totalSalary: { type: Number, required: true },
  payslipUrl: String,
}, { timestamps: true });

// Export the Payroll model to be used in other parts of the application
const payrollModel = model('Payroll', payrollSchema);

export default payrollModel;