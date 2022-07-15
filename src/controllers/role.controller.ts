import { NextFunction, Request, Response } from 'express';
import { jsonAll } from '../utils/general';
import Role from '../models/role';

//CREATE AUTOMATIC ROLE AT FIRST WHEN WE CREATE NEW DB
export function crateRole() {
    Role.estimatedDocumentCount((err: any, count: number) => {
        if (!err && count === 0) {
            new Role({
                name: 'user',
            }).save((err) => {
                if (err) {
                    console.log('error', err);
                }
                console.log("added 'user' to roles collection");
            });

            new Role({
                name: 'admin',
            }).save((err) => {
                if (err) {
                    console.log('error', err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}

//GET ROLES LIST
const getAllRole = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let pageOptions: { page: number; limit: number } = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
        };
        const count = await Role.countDocuments({});
        //GETING DATA FROM TABLE
        const roles = await Role.find()
            .limit(pageOptions.limit * 1)
            .skip((pageOptions.page - 1) * pageOptions.limit)
            .sort({ createdAt: -1 });
        //CREATE RESPONSE
        const result = {
            roles,
        };
        //CREATE PAGINATION
        const meta = {
            total: count,
            limit: pageOptions.limit,
            totalPages: Math.ceil(count / pageOptions.limit),
            currentPage: pageOptions.page,
        };
        //SEND RESPONSE
        return jsonAll(res, 201, result, meta);
    } catch (error) {
        next(error);
    }
};

//EXPORT
export default {
    getAllRole,
};
