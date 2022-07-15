import { NextFunction, Request, Response } from 'express';
import HttpError from '../utils/httpError';
import { jsonOne } from '../utils/general';
import { matchedData } from 'express-validator';
import User, { IUserModel } from '../models/user';
import { generateJWT } from '../utils';
import generateResetPasswordTemplate from '../templates/resetPasswordTemplate';
import MailService from '../services/mailService';
import { generateOtp, verifyOtp } from '../utils';
import otpMaster from '../models/otpMaster';
import { OtpType } from '../utils/enums';
import { compare, hash } from 'bcrypt';
import { AuthInterface } from '../interfaces/authInterface';

//GENERATE TOKEN FOR LOGIN
const tokenBuilder = async (user: IUserModel) => {
    const accessToken = generateJWT(
        {
            id: user._id,
            role: user.role?.name,
            tokenType: 'access',
        },
        {
            issuer: user.email,
            subject: user.email,
            audience: 'root',
        }
    );

    return {
        accessToken: accessToken,
    };
};

//USER LOGIN
const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<AuthInterface> => {
    try {
        let bodyData = matchedData(req, {
            includeOptionals: true,
            locations: ['body'],
        });

        const { email, password } = bodyData;

        let user = await User.findOne({ email }).populate('role');

        const isValidPass = await compare(password, user.password);
        //CHECK FOR USER VERIFIED AND EXISTING
        if (!user.isEmailVerified) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'Please confirm your account by confirmation email OTP and try again',
                code: 400,
            });
        } else if (!user || !isValidPass) {
            throw new HttpError({
                title: 'bad_login',
                detail: 'You have entered an invalid email address or password',
                code: 400,
            });
        }
        //CREATE TOKEN
        const token = await tokenBuilder(user);
        const response = {
            user,
            accessToken: token.accessToken,
        };
        return jsonOne<AuthInterface>(res, 200, response);
    } catch (error) {
        next(error);
    }
};

//USER GORGOT PASSWORD
const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email }).populate('role');

        //CHECK FOR USER VERIFIED AND EXISTING
        if (!user.isEmailVerified) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'Please confirm your account by confirmation email OTP and try again',
                code: 400,
            });
        } else if (!user) {
            throw new HttpError({
                title: 'bad_login',
                detail: 'You have entered an invalid email address or password',
                code: 400,
            });
        }

        let tokenExpiration: any = new Date();
        tokenExpiration = tokenExpiration.setMinutes(
            tokenExpiration.getMinutes() + 10
        );

        const otp: string = generateOtp(6);

        let newOtp = new otpMaster({
            userId: user._id,
            type: OtpType.FORGET,
            otp,
            otpExpiration: new Date(tokenExpiration),
        });
        await newOtp.save();

        //GENERATE OTP AND SEND ON MAIL
        const emailTemplate = generateResetPasswordTemplate(
            otp,
            user.firstName
        );

        //SEND FORGOT PASSWORD EMAIL
        const mailService = MailService.getInstance();
        await mailService.sendMail(req.headers['X-Request-Id'], {
            to: email,
            subject: 'Reset Password',
            html: emailTemplate.html,
        });
        return jsonOne<string>(
            res,
            200,
            'Forget Password OTP sent successfully'
        );
    } catch (e) {
        next(e);
    }
};

//VERIFY OTP FOR FORGOT PASSWORD
const verifyForgetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, otp } = req.body;

        let user = await User.findOne({ email }).populate('role');
        //IF USER NOT EXISTS
        if (!user) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'You have entered an invalid email address.',
                code: 400,
            });
        }
        //CHECK FOR OTP
        let isOtpValid = await verifyOtp(user._id, otp, OtpType.FORGET);
        if (!isOtpValid) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'This OTP has expired.',
                code: 400,
            });
        }

        return jsonOne<string>(res, 200, 'Able to reset the password');
    } catch (e) {
        next(e);
    }
};

//RESET PASSWORD
const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, otp, password } = req.body;

        let user = await User.findOne({ email });
        //IF USER NOT EXISTS
        if (!user) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'You have entered an invalid email address.',
                code: 400,
            });
        }
        //CHECK FOR OTP
        let isOtpValid = await verifyOtp(user._id, otp, OtpType.FORGET);
        if (!isOtpValid) {
            throw new HttpError({
                title: 'bad_request',
                detail: 'This OTP has Invalid.',
                code: 400,
            });
        }
        //ADD NEW PASSWORD
        const hashPassword = await hash(password, 12);
        user.password = hashPassword;

        await user.save();

        await otpMaster.findByIdAndDelete(isOtpValid);

        return jsonOne<string>(res, 200, 'Password updated successfully');
    } catch (e) {
        next(e);
    }
};

//EXPORT
export default {
    login,
    forgotPassword,
    verifyForgetPassword,
    resetPassword,
};
