import { Router } from 'express';
import validate from '../../middlewares/validationMiddleware';
import { authController } from '../../controllers';
import { emailAddress, loginPassword } from '../../validators/authValidator';
import { password } from '../../validators/userValidator';
import { requiredTextField } from '../../validators/commonValidator';

//AUTH ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//USER LOGIN
_router
    .route('/login')
    .post(validate([emailAddress(), loginPassword()]), authController.login);

//USER FORGOT PASSWORD
_router
    .route('/forgot-password')
    .post(validate([emailAddress()]), authController.forgotPassword);

//USER VERIFY OTP FOR FORGOT PASSWORD
_router
    .route('/verify-otp')
    .post(
        validate([
            emailAddress(),
            requiredTextField('otp', 'Otp', { min: 2, max: 255 }),
        ]),
        authController.verifyForgetPassword
    );

//USER RESET PASSWORD FOR FORGOT PASSWORD
_router
    .route('/reset-password')
    .post(
        validate([
            password('password'),
            password('confirmPassword'),
            requiredTextField('otp', 'Otp', { min: 2, max: 255 }),
            emailAddress(),
        ]),
        authController.resetPassword
    );

//EXPORT
export const router = _router;
