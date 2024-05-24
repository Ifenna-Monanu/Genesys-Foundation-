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
                You Have Made a Meaningful Impact!
            </h1>
        </div>

        <div style="padding: 25px 0px; border-color: #EFEFEF; border-bottom-width: 1px; border-bottom-style: solid;">
            <h1 style="font-size: 32px; padding-bottom: 12px;">Hello ${token}</h1>
            <p style="padding-bottom: 12px; font-size: 16px;">
                We are writing to express our heartfelt gratitude for your generous contribution. Your support is directly nurturing the aspirations of young, economically disadvantaged, and vulnerable individuals across Africa.            </p>
            <p style="padding-bottom: 12px; font-size: 16px;">
                Thanks to you, we can continue to provide essential training and resources to countless young, economically disadvantaged, and vulnerable individuals. With every donation, we move closer to a world where everyone has the opportunity to learn, grow, and contribute to the technological landscape.            </p>
            <p style="padding-bottom: 12px; font-size: 16px;">
                We are thrilled to count you among our esteemed community of supporters. Your involvement is a powerful vote of confidence in our mission, and for that, we are immensely grateful.  </p>
           <p style="padding-bottom: 12px; font-size: 16px;">
           Should you wish to share your thoughts or learn more about our ongoing projects, please don't hesitate to reach out at <a href="mailto: donation@genesysfoundation.org" >donation@genesysfoundation.org</a> or visit our website, <a href="www.genesysfoundation.org" style="font-weight: 500"}>www.genesysfoundation.org</a>.        </p>
        <p style="padding-bottom: 12px; font-size: 16px;">
            Together, we are unlocking potential and inspiring innovation.
        </p>
        </div>
        <div style="padding: 16px 0px ;">
            <p style="font-size: 16px; padding-bottom: 15px; >Warm Regards </p>
            <b style="font-size: 16px;">Nnamdi Anika</b>
            <p style="font-size: 16px; margin-top: -4px">MD, Genesys Foundation</p>
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


async function sendEmailComfirmation (prop: MailOptions) {
    const {to, token} = prop;
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
        <h1>${token}</h1>
    <body>
    </body>
    `
    const mailer = await transporter();
    const options = await mailOptions(to, message, `Genesys Foundation: Comfirm Your Mail`, {
      token,
    });
    const mail = await mailer.sendMail(options);
    return mail;
}

async function sendPasswordResetEmail (prop: MailOptions) {
    const {to, token} = prop;
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
        <h1>${token}</h1>
    <body>
    </body>
    `
    const mailer = await transporter();
    const options = await mailOptions(to, message, `Genesys Foundation: Password Reset`, {
      token,
    });
    const mail = await mailer.sendMail(options);
    return mail;
}

export { sendDonationMail, sendPasswordResetEmail, sendEmailComfirmation };
