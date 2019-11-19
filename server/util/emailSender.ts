const nodemailer = require("nodemailer");
import LogService from '../api/services/logs.service';
import { Logs } from '../api/model/logs';

export default class EmailSender{

constructor(){}


   static sendEmail(mensaje,nroReclamo, email):String{

    let transporter = nodemailer.createTransport( {
      host: 'smtp.mailtrap.io',
      port: 2525,
      auth: {
          user: "0b5b2a8d66ff88",
          pass: "98ce5f02ee248b"
      }
    });
  
    let mailOptions = {
      from: "reclamos@reclamosuade.com.ar",
      to: email,
      
      subject: `Informacion sobre tu reclamo Nro ${nroReclamo}`,
      text: `${mensaje}`
    };
    
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          LogService.save(new Logs("Error",`Hubo un error en el envio del mail a ${email} por el reclamo nro ${nroReclamo} - ${error}`));
          return error;
        } else {
          LogService.save(new Logs("Success",`Se envio el mail a ${email} por el reclamo nro ${nroReclamo}`));
          return;
        }
    });
    return;
  }
}
