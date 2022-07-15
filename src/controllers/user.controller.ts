import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne, jsonAll } from '../utils/general';
import { generateOtp, verifyOtp } from '../utils';
import verifyEmailTamplate from '../templates/verifyEmailTemplate';
import MailService from '../services/mailService';
import { RoleType, OtpType } from '../utils/enums';
import User, { IUserModel } from '../models/user';
import Role from '../models/role';
import otpMaster from '../models/otpMaster';
import { hash } from 'bcrypt';
import { IUser } from '../interfaces';

//CREATE USER & SEND MAIL FOR VERIFICATION
const createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, avatar, email, password } = req.body;
        //FIND EXIST USES
        const userExist = await User.exists({ email });
        if (userExist) {
            throw new HttpError({
                title: 'emailAddress',
                detail: 'Email address is already used',
                code: 422,
            });
        }
        //GET ROLE
        const role = await Role.findOne({ name: RoleType.USER });
        if (!role) {
            throw new HttpError({
                title: 'role',
                detail: 'User role not found',
                code: 422,
            });
        }
        //ENCRYPTION PASSWORD
        const hashPassword = await hash(password, 12);
        //CRETA NEW USRE
        let user = new User({
            firstName,
            lastName,
            avatar,
            email,
            password: hashPassword,
            role: role._id,
        });
        let savedUser = await user.save();

        //GENERATE OTP FOR MAIL VERIFICATION
        let tokenExpiration: any = new Date();
        tokenExpiration = tokenExpiration.setMinutes(
            tokenExpiration.getMinutes() + 10
        );

        const otp: string = generateOtp(6);

        let newOtp = new otpMaster({
            userId: savedUser._id,
            type: OtpType.VERIFICATION,
            otp,
            otpExpiration: new Date(tokenExpiration),
        });
        await newOtp.save();

        //SEND VERIFICATION MAIL TO USER
        const emailTemplate = verifyEmailTamplate(otp);
        const mailService = MailService.getInstance();
        await mailService.sendMail(req.headers['X-Request-Id'], {
            to: user.email,
            subject: 'Verify OTP',
            html: emailTemplate.html,
        });
        //SENDING RESPONSE
        return jsonOne<IUserModel>(res, 201, savedUser);
    } catch (error) {
        next(error);
    }
};

//VERIFY USER
const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;
        //FINDIND USER
        let user = await User.findOne({ email });
        //IF USER NOT FOUND
        if (!user) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'You have entered an invalid email address.',
                code: 400,
            });
        } else if (user.isEmailVerified) {
            return jsonOne<string>(res, 200, 'User Email Is Already Verified.');
        }

        //VERIFYING OTP
        let isOtpValid = await verifyOtp(user._id, otp, OtpType.VERIFICATION);

        if (!isOtpValid) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'This OTP has Invalid.',
                code: 400,
            });
        }
        user.isEmailVerified = true;
        user.save();
        //DELETE OTP
        await otpMaster.findByIdAndDelete(isOtpValid);
        //SENDING RESPONSE
        return jsonOne<string>(res, 200, 'Email Verification Successfull.');
    } catch (error) {
        next(error);
    }
};

//GET USER DETAILS BY ID
const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;

        let data = await User.findById(userId).populate('role');

        return jsonOne<IUser>(res, 200, data);
    } catch (error) {
        next(error);
    }
};

//GET ALL USER LIST
const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pageOptions: { page: number; limit: number } = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };

        const count = await User.countDocuments({});
        //GETING DATA FROM TABLE
        let users = await User.find()
            .populate('role')
            .limit(pageOptions.limit * 1)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .sort({ createdAt: -1 });
        //CREATE PAGINATION
        const meta = {
            total: count,
            limit: pageOptions.limit,
            totalPages: Math.ceil(count / pageOptions.limit),
            currentPage: pageOptions.page,
        };
        return jsonAll<any>(res, 200, users, meta);
    } catch (error) {
        next(error);
    }
};

//UPDATE USER DETAILS WITH ID
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body;
        const payload = req['tokenPayload'];
        const userId = payload['id'];

        /** Check if user is trying to update another user data */
        if (userId !== req.params.userId) {
            throw new HttpError({
                title: 'forbidden',
                detail: 'Access Forbidden',
                code: 403,
            });
        }
        let user = await User.findById(userId);
        //If User not found
        if (!user) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'User Not Found.',
                code: 400,
            });
        }
        let isProfileCompleted = true;

        let savedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                firstName: body.firstName,
                lastName: body.lastName,
                gender: body.gender,
                dateOfBirth: body.dateOfBirth,
                residence: body.residence,
                avatar: body.avatar,
                isProfileCompleted,
            },
            { new: true }
        );
        return jsonOne<IUserModel>(res, 200, savedUser);
    } catch (error) {
        next(error);
    }
};

//EXPORT
export default {
    createUser,
    verifyEmail,
    getUser,
    getAllUser,
    updateUser,
};
