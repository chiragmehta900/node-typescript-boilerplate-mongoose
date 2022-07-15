import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/httpError';

const permit = function (allowedRoles: Array<string>) {
    return async function (req: Request, res: Response, next: NextFunction) {
        const payload = req['tokenPayload'];
        if (allowedRoles.includes(payload['role'])) {
            next();
        } else {
            next(
                new HttpError({
                    title: 'forbidden',
                    detail: 'Access Forbidden',
                    code: 403,
                })
            );
        }
    };
};
export default permit;
