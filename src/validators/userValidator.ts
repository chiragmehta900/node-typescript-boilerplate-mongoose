import { body } from 'express-validator';

//PASSWORD VALIDATOR FUNCTION
const password = (field) => {
    return body(field)
        .trim()
        .escape()
        .isString()
        .isLength({ min: 8 })
        .withMessage(
            `${
                field === 'password' ? 'Password' : 'Confirm password'
            } should not be empty and at a minimum eight characters.`
        )
        .bail()
        .custom((value, { req }) => {
            if (field === 'confirmPassword' && value !== req.body.password) {
                throw new Error(
                    'Password confirmation does not match password'
                );
            }
            return true;
        });
};

//RESET PASSWORD VALIDATOR FUNCTION
const resetPassword = (field) => {
    return body(field)
        .trim()
        .escape()
        .isString()
        .isLength({ min: 8 })
        .withMessage(
            `${field} should not be empty and at a minimum eight characters.`
        )
        .bail()
        .custom((value, { req }) => {
            if (
                field === 'confirmationPassword' &&
                value !== req.body.newPassword
            ) {
                throw new Error(
                    'Confirmation password does not match password'
                );
            }
            return true;
        });
};

//EXPORT
export { password, resetPassword };
