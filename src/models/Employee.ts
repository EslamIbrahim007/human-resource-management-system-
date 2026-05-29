import { Schema, model, Document } from "mongoose";

//  Interface for Employee Document
export interface IEmployee extends Document {
  employeeCode: string;
  userId: Schema.Types.ObjectId;
  departmentId: Schema.Types.ObjectId;
  managerId?: Schema.Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date | null;
  deletedBy?: Schema.Types.ObjectId | null;
  personalInfo: {
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'prefer_not_to_say';
    phone?: string;
    personalEmail?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
  };
  workInfo: {
    designation: string;
    employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
    joinDate: Date;
    probationEndDate?: Date;
    workLocation?: string;
    status: 'active' | 'probation' | 'on_leave' | 'terminated' | 'resigned';
    exitDate?: Date;
    exitReason?: 'resignation' | 'termination' | 'retirement' | 'end_of_contract';
  };
  bankDetails: {
    bankName?: string;
    branch?: string;
    accountNumber?: string;
    ifscCode?: string;
      };
  documents: {
    type: 'contract' | 'id_proof' | 'certification' | 'resume' | 'offer_letter' | 'other';
    url: string;
    originalName?: string;
    uploadedAt: Date;
  }[];
  emergencyContact?: {
    name?: string;
    phone?: string;
    relationship?: string;
  };
  fullName?: string; // Virtual field
  compensation?: {
    currentSalary?: number;
    currency?: string;
  };
}

//Schema Definition
const employeeSchema = new Schema<IEmployee>({
  // Top-level identifiers:
  employeeCode: { type: String, required: true, unique: true, immutable: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
  departmentId: { type: Schema.Types.ObjectId, ref: 'Department', required: true },
  managerId: { type: Schema.Types.ObjectId, ref: 'Employee' },

  // personalInfo
  personalInfo: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'prefer_not_to_say'] },
    phone: { type: String },
    personalEmail: { type: String, lowercase: true },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      state: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
  },

  // workInfo
  workInfo: {
    designation: { type: String, required: true },
    employmentType: { type: String, enum: ['full_time', 'part_time', 'contract', 'intern'], required: true },
    joinDate: { type: Date, required: true },
    probationEndDate: { type: Date },
    workLocation: { type: String, trim: true },
    status: {
      type: String,
      enum: ['active', 'probation', 'on_leave', 'terminated', 'resigned'],
      default: 'active'
    },
    exitDate: { type: Date },
    exitReason: { type: String, enum: ['resignation', 'termination', 'retirement', 'end_of_contract'] },
  },

  // bankDetails
  bankDetails: {
    bankName: { type: String, trim: true },
    branch: { type: String, trim: true },
    accountNumber: { type: String },
    ifscCode: { type: String },

  },
  compensation: {
    currentSalary: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' }
  },
  // Soft Delete Fields
  isDeleted: { type: Boolean, default: false, index: true },
  deletedAt: { type: Date, default: null },
  deletedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },

  documents: [{
    type: { type: String, enum: ['contract', 'id_proof', 'certification', 'resume', 'offer_letter', 'other'], required: true },
    url: { type: String, required: true },
    originalName: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],

  emergencyContact: {
    name: { type: String, trim: true },
    phone: { type: String },
    relationship: { type: String, trim: true }
  }

}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret: Record<string, any>) {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    }
  },
  toObject: { virtuals: true }
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function (this: IEmployee) {
  return `${this.personalInfo.firstName} ${this.personalInfo.lastName}`;
});

// Soft delete middleware
employeeSchema.pre(/^find/, function (this: any, next) {
  this.where({ isDeleted: false });
  next();
});

// Indexes
employeeSchema.index({ departmentId: 1, 'workInfo.status': 1 });
employeeSchema.index({ 'workInfo.status': 1 });
employeeSchema.index({ managerId: 1 });

// Export the Employee model
export default model<IEmployee>("Employee", employeeSchema);