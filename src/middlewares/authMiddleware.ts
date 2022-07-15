import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../utils';
import HttpError from '../utils/httpError';

const auth = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization;
        const payload = validateToken(token);

        if (payload['tokenType'] !== 'access') {
            throw new HttpError({
                title: 'unauthorized',
                detail: 'Invalid Authorization header',
                code: 401,
            });
        }
        req['tokenPayload'] = payload;
        next();
    } catch (e) {
        if (e.opts?.title === 'invalid_token') {
            next(
                new HttpError({
                    title: 'unauthorized',
                    detail: 'Invalid Authorization header',
                    code: 401,
                })
            );
        } else {
            next(e);
        }
    }
};

export default auth;
