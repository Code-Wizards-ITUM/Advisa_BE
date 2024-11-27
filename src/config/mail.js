require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  secure: false,
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
exports.sendEmail=(to,subject,body)=>transporter
  .sendMail({
    to: to,
    subject: subject,
    html: `<p>${body}</p>`,
  })
  .catch((err) => {
    console.log(err);
  });

