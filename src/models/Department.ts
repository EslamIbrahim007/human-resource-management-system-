import { Schema, model,Document, Query } from "mongoose";


interface IDepartment extends Document {
  name: string;
  description?: string
  code: string;
  parentDepartmentId?: Schema.Types.ObjectId | null
  headId?: Schema.Types.ObjectId | null
  location?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: Schema.Types.ObjectId | null;
}
const departmentSchema = new Schema<IDepartment>({
  // Basic Department Information
  name: { type: String, required: true, unique: true }, // e.g., "Human Resources"
  description: { type: String,optional:true,maxlength:500 ,trim:true},  // Brief description of the department's purpose
  code: { type: String, required: true, unique: true ,trim: true,uppercase:true},// Department code (e.g., "HR")
  parentDepartmentId:{ // in case of sub-department
    type: Schema.Types.ObjectId,
    
    ref: 'Department',
    default:null
  },
  headId:{ // head of the department
    type: Schema.Types.ObjectId,
    
    ref: 'Employee',
    default:null
  },
  location: { // location of the department
    type: String,
    trim:true,
    minlength: 3,
    maxlength: 50,
  },
  isActive:{
    type: Boolean,
    default: true
  },
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }
}, {
  timestamps: true,
  //to enable virtuals populate
  
});
// soft delete
departmentSchema.pre(/^find/, function (this: Query<any, IDepartment>, next) {
  this.where({ isDeleted: false });
  next();
});

// indexes
departmentSchema.index({parentDepartmentId:1});
departmentSchema.index({isActive:1});


export default model("Department", departmentSchema);