const Mailgun = require('mailgun-js');
const path = require('path');

let mailGunDomainKey;
let mailgunApiKey;

if (!process.env.MAILGUN_API_KEY) {
  const { domain, apiKey } = require('../config.js');
  mailGunDomainKey = domain;
  mailgunApiKey = apiKey;
}

const sendEmail = (toFromEmail, filePath) => {
  // sent email to notify of error
  const apiKeyz = process.env.MAILGUN_API_KEY || mailgunApiKey;
  const domainz = process.env.MAILGUN_DOMAIN || mailGunDomainKey;
  const mailgun = new Mailgun({ apiKey: apiKeyz, domain: domainz });
  const filePathName = `./${filePath}.png`;
  const filepath = path.join(__dirname, filePathName);
  console.log('image file path sent to email ', filePath)
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