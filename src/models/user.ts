import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from '../interfaces';

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface IUserModel extends IUser, Document {}

//DEFINE USER SCHEMA
const UserSchema: Schema = new Schema(
    {
        firstName: {
            type: String,
            default: '',
        },
        lastName: {
            type: String,
            default: '',
        },
        gender: {
            type: String,
            default: 'male',
        },
        dateOfBirth: {
            type: Date,
            default: null,
        },
        residence: {
            type: String,
            default: '',
        },
        avatar: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: 8,
        },
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role',
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isProfileCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

//EXPORT
export default mongoose.model<IUserModel>('User', UserSchema);
