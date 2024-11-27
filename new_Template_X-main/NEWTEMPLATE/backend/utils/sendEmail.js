import nodemailer from "nodemailer";

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  //Create Email Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,  
    secure: true,
    logger: true,
    secureConnection: false,
    auth: {
      //object ekk nisa
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //Option for sending email
  const options = {
    from: sent_from,
    to: send_to,
    replyTo: reply_to,
    subject: subject,
    html: message,
  };

  // send email
  transporter.sendMail(options, function (error, info) {
    if (error) {
      console.log(error);
    }
    console.log(info);
  });
};

export default sendEmail;
