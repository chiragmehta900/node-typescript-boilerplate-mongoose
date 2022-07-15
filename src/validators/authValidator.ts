import { body, header } from 'express-validator';
import { extractToken } from '../utils';

// AUTHORIZATION HEADER VALIDATOR FUNCTION
const authorization = () => {
    return header('authorization')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .withMessage('Missing authentication header')
        .bail()
        .customSanitizer((token, { location }) => {
            if (location === 'headers') {
                return extractToken(token);
            }
        })
        .isJWT()
        .withMessage(
            'Invalid Authorization header, must be Bearer authorization'
        );
};

//EMAIL VALIDATOR FUNCTION
const emailAddress = () => {
    return body('email')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .withMessage('Email address is required')
        .bail()
        .isLength({
            min: 3,
            max: 100,
        })
        .withMessage('Email address must be between 3 and 100 characters')
        .bail()
        .isEmail()
        .withMessage('Email address is not valid')
        .customSanitizer((email) => {
            return email.toLowerCase();
        });
};

//LOGIN PASSWORD VALIDATOR FUNCTION
const loginPassword = () => {
    return body('password')
        .trim()
        .escape()
        .exists()
        .notEmpty()
        .isString()
        .isLength({
            max: 255,
        })
        .withMessage('Password is not valid');
};

/** Token */
// const token = (field) => {
//     return body(field)
//         .trim()
//         .escape()
//         .exists()
//         .notEmpty()
//         .withMessage('Token is required')
//         .bail()
//         .isJWT()
//         .withMessage('Invalid token');
// };

//EXPORT
export {
    authorization,
    emailAddress,
    loginPassword,
    // token
};
