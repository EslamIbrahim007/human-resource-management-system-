import mongoose, { Schema, Document, Query } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    role: 'SUPER_ADMIN' | 'HR_MANAGER' | 'HR_EXECUTIVE' | 'EMPLOYEE' | 'FINANCE';
    status: 'active' | 'suspended' | 'inactive';
    isEmailVerified: boolean;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    passwordChangedAt?: Date;
    lastLogin?: Date;
    isDeleted: boolean;
    deletedBy?: Schema.Types.ObjectId;
    createdBy?: Schema.Types.ObjectId;
    updatedBy?: Schema.Types.ObjectId;
// Methods 
    comparePassword: (password: string) => Promise<boolean>;
    changedPasswordAfter: (JWTTimestamp: number) => boolean;
}

const UserSchema: Schema = new Schema<IUser>({
    email: { type: String, required: true, unique: true,lowercase:true,trim:true },
    password: { type: String, required: true, select: false, minlength: 8 },
    role: { type: String, enum: ['SUPER_ADMIN', 'HR_MANAGER', 'HR_EXECUTIVE', 'EMPLOYEE', 'FINANCE'], default: 'EMPLOYEE' },
    status: { type: String, enum: ['active', 'suspended', 'inactive'], default: 'active' },
    isEmailVerified: { type: Boolean, default: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    passwordChangedAt: { type: Date },
    lastLogin: { type: Date },
    
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedBy: { type: Schema.Types.ObjectId, ref: 'User' },
},{
    timestamps: true,
});
//comparePassword
UserSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password||'');
};
// changedPasswordAfter
UserSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
    if (this.passwordChangedAt) {
        return Math.floor(this.passwordChangedAt.getTime() / 1000) > JWTTimestamp;
    }
    return false;
};
//Pre-save hook
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = new Date(Date.now() - 1000);
    next();
});
//soft delete
UserSchema.pre(/^find/, function (this: Query<any, IUser>, next) {
    this.where({ isDeleted: false });
    next();
});

export default mongoose.model<IUser>('User', UserSchema);