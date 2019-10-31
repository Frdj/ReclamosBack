const nodemailer = require("nodemailer");

export default class EmailSender{
/*var transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com", // hostname
    secureConnection: false, // TLS requires secureConnection to be false
    port: 587, // port for secure SMTP
    tls: {
       ciphers:'SSLv3'
    },
    auth: {
        user: 'niko_98_99@hotmail.com',
        pass: 'lavieja9899'
    }
});*/

constructor(){}


  static sendEmail = (mensaje,nroReclamo, email) => {
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
          throw error;
        } else {
          console.log("Email successfully sent!");
        }
      });
  }
}