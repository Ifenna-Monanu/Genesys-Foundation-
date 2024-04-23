import * as nodemailer from 'nodemailer';
import * as hsb from 'nodemailer-express-handlebars';

const account = {
  user: 'wallex@zohomail.com',
  pass: 'Aka@god26',
};

function transporter() {
  return nodemailer
    .createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    })
    
}

async function mailOptions(to: string, html: string, subject: string, props?: object) {
  const options = {
    from: `Genesys Tech Hub<wallex@zohomail.com>`,
    to: to,
    subject: subject,
    html: html
    
  };
  return options;
}

export { mailOptions, transporter };
