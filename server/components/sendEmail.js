const nodemailer = require("nodemailer");

async function sendEmail(email, subject, body) {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: body,
    };

    const info = await transporter.sendMail(mailOptions);
    return { error: false, message: "Email sent.", detailed: info };
  } catch (err) {
    return {
      error: true,
      message: `Some error occurred while sending the email. Make sure the email is valid and try again later.`,
      detailed: err,
    };
  }
}

module.exports = sendEmail;
