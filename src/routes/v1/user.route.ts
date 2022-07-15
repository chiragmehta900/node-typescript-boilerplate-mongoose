import { Router } from 'express';
import { authorization, emailAddress } from '../../validators/authValidator';
import validate from '../../middlewares/validationMiddleware';
import auth from '../../middlewares/authMiddleware';
import permit from '../../middlewares/permissionMiddleware';
import { password } from '../../validators/userValidator';
import { requiredTextField } from '../../validators/commonValidator';
import { RoleType } from '../../utils/enums';
import { userController } from '../../controllers';

//USER ROUTES//
const _router: Router = Router({
    mergeParams: true,
});

//USER SIGNUP
_router
    .route('/sign-up')
    .post(
        validate([
            emailAddress(),
            password('password'),
            password('confirmPassword'),
        ]),
        userController.createUser
    );

//USER VERFIY THERE EMAIL
_router
    .route('/verify-email')
    .post(
        validate([
            emailAddress(),
            requiredTextField('otp', 'Otp', { min: 2, max: 255 }),
        ]),
        userController.verifyEmail
    );

//UPDATE USER DETAILS
_router.route('/update/:userId').patch(
    validate([
        authorization(),
        requiredTextField('firstName', 'FirstName', { min: 2, max: 255 }),
        requiredTextField('lastName', 'LastName', { min: 2, max: 255 }),
        requiredTextField('dateOfBirth', 'Date Of Birth', {
            min: 2,
            max: 255,
        }),
        requiredTextField('residence', 'Residence', { min: 2, max: 255 }),
        requiredTextField('avatar', 'Avatar', { min: 2, max: 255 }),
    ]),
    auth,
    permit([RoleType.ADMIN, RoleType.USER]),
    userController.updateUser
);

//GET USER DETAILS BY ID
_router
    .route('/fetch/:userId')
    .get(
        validate([authorization()]),
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        userController.getUser
    );

//GET ALL USER LIST
_router
    .route('/fetch')
    .get(
        validate([authorization()]),
        auth,
        permit([RoleType.ADMIN, RoleType.USER]),
        userController.getAllUser
    );

//EXPORT
export const router = _router;
