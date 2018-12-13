import {bind} from "decko";
import {Request, Response, NextFunction} from "express";
import {createTransport} from "nodemailer";
import {compileFile} from "pug";
import {join} from "path";

export class MessageController {
    private readonly transporter = createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secure: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
            ciphers:'SSLv3'
        },
        auth: {
            user: 'no.reply.kavana.revestimientos@outlook.com',
            pass: 'v5V0S*1l'
        }
    });

    private readonly emailTemplate = compileFile(join(process.cwd(), 'email-templates', 'message.pug'));

    @bind
    async sendMessage(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            console.log(req.body);
            const emailHtml = this.emailTemplate({
                ...req.body
            });

            await this.transporter.sendMail({
                to: 'info@kavanarevestimientos.com',
                subject: `${req.body.name} ${req.body.lastname} desea contactar con nuestro equipo`,
                html: emailHtml
            });

            res.status(200).json({
                message: 'El mensaje ha sido enviado con exito. Por favor espere que nuestro se comunique con' +
                    ' usted'
            })

        } catch (error) {
            next(error);
        }
    }


}