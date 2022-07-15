import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import config from './config/config';
import Logging from './library/Logging';
import { router as v1 } from './routes/v1/index';
import MailService from './services/mailService';
import HttpError from './utils/httpError';
import { crateRole } from './controllers/role.controller';

const router = express();

//CONNECTION TO MONGOOSE DATABASE
mongoose
    .connect(config.mongo.url, { retryWrites: true, w: 'majority' })
    .then(() => {
        Logging.info(`Running on ENV = ${process.env.NODE_ENV}`);
        Logging.info('Connected to mongoDB.');
        StartServer();
        crateRole();
    })
    .catch((error) => {
        Logging.error('Unable to connect.');
        Logging.error(error);
    });

//ONLY START THE SERVER IF MONGOOSE IS CONNECTS
const StartServer = async () => {
    //MAIL SMTP CONNECTION
    Logging.info('Connecting with SMTP Server...');
    const mailService = MailService.getInstance();
    if (process.env.NODE_ENV === 'local') {
        await mailService.createLocalConnection();
    } else if (process.env.NODE_ENV === 'production') {
        await mailService.createConnection();
    }
    Logging.info('SMTP Server Connected');
    Logging.info('SMTP Connection verified');

    router.use((req, res, next) => {
        Logging.info(
            `Incomming -> Method: [${req.method}] - Url: [${req.url}] - IP: [${req.socket.remoteAddress}]`
        );
        res.on('finish', () => {
            Logging.info(
                `Incomming -> Method: [${req.method}] - Url: [${req.url}] IP: [${req.socket.remoteAddress}] - Status: [${res.statusCode}]`
            );
        });
        next();
    });

    router.use(express.urlencoded({ extended: true }));
    router.use(express.json());

    //RULES OF OUR APIS
    router.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header(
            'Access-Control-Allow-Headers',
            'Origin,X-Requested-with,Content-Type,Accept,Authorization'
        );

        if (req.method == 'OPTIONS') {
            res.header(
                'Access-Control-Allow-Methods',
                'PUT,POST,PATCH,DELETE,GET'
            );
            return res.status(200).json({});
        }
        next();
    });

    //API ROUTES WITH VERSION
    router.use('/api', v1);

    //API HEALTHCHECK
    router.get('/ping', (req, res, next) =>
        res.status(200).json({ message: 'pong' })
    );

    //API MAIN ROUTER "/"
    router.get('/', (_, res) => {
        res.status(200).json({
            success: true,
            message:
                'You are on node-typescript-boilderplate. You should not have further access from here.',
        });
    });

    //API ERROR HANDLING
    router.use((req, res, next) => {
        const error = new Error('not found');
        Logging.error(error);
        return res.status(404).json({ success: false, message: error.message });
    });

    //HANDEL ALL ERROR THROW BY CONTROLLERS
    router.use(function (err: any, req: any, res: any, next: any) {
        Logging.error(err.stack);

        if (err instanceof HttpError) {
            return err.sendError(res);
        } else {
            return res.status(500).json({
                error: {
                    title: 'general_error',
                    detail: 'An error occurred, Please retry again later',
                    code: 500,
                },
            });
        }
    });

    //YOUR SERVER LISTEN
    http.createServer(router).listen(config.server.port, () =>
        Logging.info(`Server is running on port ${config.server.port}.`)
    );
};
