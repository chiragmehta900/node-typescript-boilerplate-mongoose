import { Response } from '../interfaces';

//SEND RESPONSE FOR LIST
const jsonAll = function <Res>(
    res: any,
    status: number,
    data: Res | Array<Res>,
    meta: Object = {}
): Response<Res> {
    return res.status(status).json({
        data: data,
        meta: {
            ...meta,
        },
    });
};

//SEND RESPONSE FOR DETAIL
const jsonOne = function <Res>(res: any, status: number, data: Res): Res {
    return res.status(status).json({
        data,
    });
};

//EXPORT
export { jsonAll, jsonOne };
