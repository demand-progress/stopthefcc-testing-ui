const Mailgun = require('mailgun-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = (toFromEmail, filePath) => {
  // sent email to notify of error
  const mailgun = new Mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN});
  const filePathName = `./${filePath}.png`;
  const filepath = path.join(__dirname, filePathName);
  const data = {
    from: toFromEmail,
    to: toFromEmail,
    subject: `${filePath} site has an error`,
    text: 'Review site for issues',
    attachment: filepath,
  };

  // Sending the email
  mailgun.messages().send(data, (error, body) => {
    if (error) {
      console.log('we have an error: ', error);
    } else {
      console.log('email on its way', body);
    }
  });
};

module.exports = { sendEmail } ; 