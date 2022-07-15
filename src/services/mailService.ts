import nodemailer from 'nodemailer';
import { MailInterface } from '../interfaces';
import Logging from '../library/Logging';

export default class MailService {
    private static instance: MailService;
    private transporter: nodemailer.Transporter;

    private constructor() {}
    //INTSTANCE CREATE FOR MAIL
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }
    //CREATE CONNECTION FOR LOCAL
    async createLocalConnection() {
        let account = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
    }
    //CREATE CONNECTION FOR LIVE
    async createConnection() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_TLS === 'yes' ? true : false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    //SEND MAIL
    async sendMail(
        requestId: string | number | string[],
        options: MailInterface
    ) {
        return await this.transporter
            .sendMail({ 
                from: `"chiragmehta900" ${process.env.SMTP_SENDER || options.from}`,
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
            })
            .then((info) => {
                Logging.info(`${requestId} - Mail sent successfully!!`);
                Logging.info(`${requestId} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`);
                if (process.env.NODE_ENV === 'local') {
                    Logging.info(`${requestId} - Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(
                        info
                    )}`);
                }
                return info;
            });
    }
    //VERIFY CONNECTION
    async verifyConnection() {
        return this.transporter.verify();
    }
    //CREATE TRANSPOTER
    getTransporter() {
        return this.transporter;
    }
}
