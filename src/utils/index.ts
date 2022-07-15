import * as jwt from 'jsonwebtoken';
import otpMaster from '../models/otpMaster';
import HttpError from './httpError';

// USED TO GENERATE JWT WITH PAYLOAD AND OPTIONS AS PARAMETERS.
// THE PAYLOAD CONTAINS THE DATA WHICH WILL BE SET AS JWT PAYLOAD.
// OPTIONS CONTAIN JWT OPTIONS
const generateJWT = function (
    payload: object = {},
    options: object = {}
): string {
    const privateKey: any = process.env.JWT_SECRETS;
    const defaultOptions: object = {
        expiresIn: '1h',
    };

    return jwt.sign(
        payload,
        privateKey,
        Object.assign(defaultOptions, options)
    );
};

// USED TO GENERATE JWT WITH PAYLOAD AND OPTIONS AS PARAMETERS.
// THE PAYLOAD CONTAINS THE DATA WHICH WILL BE SET AS JWT PAYLOAD.
// OPTIONS CONTAIN JWT OPTIONS
const generateForgotPasswordJWT = function (
    password: string,
    payload: object = {},
    options: object = {}
): string {
    const privateKey: any = process.env.JWT_SECRETS + password;
    const defaultOptions: object = {
        expiresIn: '1h',
    };

    return jwt.sign(
        payload,
        privateKey,
        Object.assign(defaultOptions, options)
    );
};

//VALIDATE ACCESS/REFRESH TOKEN
const validateToken = function (token: string): Object {
    try {
        const publicKey: any = process.env.JWT_SECRETS;
        return jwt.verify(token, publicKey);
    } catch (e) {
        throw new HttpError({
            title: 'invalid_token',
            detail: 'Invalid token',
            code: 400,
        });
    }
};

//VALIDATE FORGOT PASSWORD ACCESS TOKEN
const validateForgotPasswordJWT = function (
    password: string,
    token: string
): Object {
    try {
        const publicKey: any = process.env.JWT_SECRETS + password;
        return jwt.verify(token, publicKey);
    } catch (e) {
        throw new HttpError({
            title: 'invalid_token',
            detail: 'Password reset link was expired',
            code: 400,
        });
    }
};

//USED TO GENERATE JWT WITH PAYLOAD AND OPTIONS AS PARAMETERS.
const extractToken = function (token: string): string | null {
    if (token?.startsWith('Bearer ')) {
        return token.slice(7, token.length);
    }
    return null;
};

//GENERATE RANDOM PASSWORD
const generateRandomPassword = function (len: number): string {
    const randomString =
        'abcdefghijklmnopqrstuvwxyzBCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let password: string = '';
    for (let index = 0; index < len; index++) {
        password +=
            randomString[Math.ceil(Math.random() * (randomString.length - 1))];
    }

    return password;
};

//GENERATE OTP
const generateOtp = function (len: number): string {
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < len; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }

    return OTP;
};

//VERIFY GENERATED OTP
const verifyOtp = async function (
    userId: any,
    otp: string,
    type: string
): Promise<any> {
    let existOtp = await otpMaster.findOne({
        userId,
        otp,
        type,
    });
    const currentDate = new Date();
    if (!existOtp || existOtp.otpExpiration < currentDate) {
        return null;
    }

    return existOtp._id;
};


//EXPORT
export {
    generateJWT,
    generateForgotPasswordJWT,
    validateToken,
    validateForgotPasswordJWT,
    extractToken,
    generateRandomPassword,
    generateOtp,
    verifyOtp,
};
