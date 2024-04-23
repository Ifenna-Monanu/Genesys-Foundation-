import { mailOptions, transporter } from './config';
import { MailOptions } from './mailer.interface';

async function sendDonationMail(prop: MailOptions) {
  const { to, token } = prop;
  const message = 
  `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto;">
        <div style="padding: 16px; max-width: 600px; margin-left: 240px; display: flex; align-items: center; justify-content: center;">
            <img src="https://res.cloudinary.com/nigerianchurch/image/upload/v1713827601/bzn3hzf4lcz2zl6ipoe5.png" width="106px" height="34px" alt="logo-img">
        </div>
        <div style="width: 100%; background-color:#E9F8FF; height: 230px; border-radius:13px; display: flex; justify-content: space-between; align-items: center;">
            <img width="260px" height="228px" src="https://res.cloudinary.com/nigerianchurch/image/upload/v1713827601/y38x3kk2kmlnbnveclet.png" alt="img-person">
            <h1 style="width: 311px; margin-top: 50px; font-size: 32px;">
                You have invested in someones Life!
            </h1>
        </div>

        <div style="padding: 25px 0px; border-color: #EFEFEF; border-bottom-width: 1px; border-bottom-style: solid;">
            <h1 style="font-size: 32px; padding-bottom: 12px;">Hello ${token}</h1>
            <p style="padding-bottom: 12px; font-size: 16px;">
                You have invested in someones Life!
            </p>
            <p style="padding-bottom: 12px; font-size: 16px;">
                Thank you for your generosity towards improving Africa through our mission to raise more tech talent.
            </p>
            <p style="padding-bottom: 12px; font-size: 16px;">
                Every amount donated to this course will be used to empower young, economically disadvantaged, and vulnerable African women and youths.
           </p>
           <p style="padding-bottom: 12px; font-size: 16px;">
            Your support motivates us to keep up the good work.
        </p>
        <p style="padding-bottom: 12px; font-size: 16px;">
            We are deeply honored to have you as a member of our community, and together, we will make a difference.
        </p>
        </div>
        <div style="padding: 16px 0px ;">
            <p style="font-size: 16px;">Warm Regards</p>
            <b style="font-size: 16px; margin-top: -4px">The Genesys Foundation Team</b>
        </div>
    </div>
</body>
</html>
  `
  const mailer = await transporter();
  const options = await mailOptions(to, message, `Genesys Foundation Donation`, {
    token,
  });
  const mail = await mailer.sendMail(options);
  return mail;
}

export { sendDonationMail };
