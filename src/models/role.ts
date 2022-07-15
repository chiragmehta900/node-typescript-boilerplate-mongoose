import mongoose, { Document, Schema } from 'mongoose';
import { IRole } from '../interfaces';

//EXPORT INTERFACE WITH MONGOOSE DOCUMENT
export interface IRoleModel extends IRole, Document {}

//DEFINE ROLE SCHEMA
const RoleSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'role is required'],
        },
    },
    { timestamps: true }
);

//EXPORT
export default mongoose.model<IRoleModel>('Role', RoleSchema);
