const nodemailer = require('nodemailer');

/* istanbul ignore file */
module.exports = async options => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: "Loongallery", //TESTINGGG --> el mfrod tkon Loongallery <loongallery5@gmail.com> aw ay enterprise gmail ykon a7sn.
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  await transporter.sendMail(mailOptions);
};
