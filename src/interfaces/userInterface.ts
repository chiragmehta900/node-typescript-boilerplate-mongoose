import { IRole } from './roleInterface';

export interface IUser {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: Date;
    residence: string;
    avatar: string;
    email: string;
    password: string;
    role: IRole;
    isEmailVerified: boolean;
    isProfileCompleted: boolean;
}
