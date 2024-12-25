import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  //1) create transporter object
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  //2) Define the email Options from , to , subject, content
  const mailOptions = {
    from: `HR:${options.from}`,
    to: options.to,
    subject: options.subject,
    text: options.text
  };
  //3) send email
  await transporter.sendMail(mailOptions)
};


export default sendEmail;