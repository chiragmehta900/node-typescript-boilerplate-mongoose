import { IUser } from './userInterface';

export interface AuthInterface {
    user: IUser;
    accessToken: string;
}
