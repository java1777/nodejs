import { createTransport } from 'nodemailer'
import { configServer } from '../config/server.js'

export const sendOTPToMail = (mail, otp) => {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: configServer.MAIL.USER,
            pass: configServer.MAIL.PASS
        },
        secure: true
    });
    const mailOptions = {
        from: configServer.MAIL.USER,
        to: mail,
        subject: 'Online_market',
        text: `${otp} — sizning OTP kodingiz 
        Muddat: 5 daqiqa.`
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.error(' Email yuborilmadi:', err);
        } else {
            console.log('Email yuborildi:', info.response);
        }
    })
}