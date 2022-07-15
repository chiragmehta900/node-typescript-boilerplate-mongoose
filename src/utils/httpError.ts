import { ApiErrorInterface } from "../interfaces";

export default class HttpError extends Error {
    public readonly opts: ApiErrorInterface;

    constructor(opts: ApiErrorInterface) {
        super(opts.detail);
        this.opts = opts;
        Error.captureStackTrace(this);
    }

    sendError(res:any) {
        return res.status(this.opts.code).json({
            errors: [
                {
                    title: this.opts.title,
                    detail: this.opts.detail,
                    code: this.opts.code,
                },
            ],
        });
    }
}
