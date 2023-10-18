const express = require('express');
var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const port = 8081;
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Access-Token, XKey, Authorization, factory-id, authorization, token, accessToken");

    next();
});

// Define an endpoint
app.post('/sendEmail', (req, res) => {
    //OTP ranges from 100000 to 900000 so it will be always 6 digit and never starts with 0.
    let otp = Math.floor(100000 + Math.random() * 900000)
    console.log("otp : ",otp);

    // Create a transporter using the Gmail SMTP server
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'rajan.reddy21@gmail.com',  // Replace with your Gmail email address
        pass: 'xorw lvig ludo mpmi',        // Replace with your Gmail password or an App Password
        },
    });

    // Email data
    const mailOptions = {
        from: 'rajan.reddy21@gmail.com', // Your Gmail email address
        to: req.body.email, // Recipient's email address
        subject: 'OTP Verification',
        text: 'You OTP Code is '+ otp +'. The code is valid for 1 minute',
    };
    
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error('Error sending email:', error);
            res.send({statusCode : 500, message : 'Something went wrong'});
        } else {
            console.log('Email sent:', info.response);
            res.send({statusCode : 200, data : { otp : otp }, message : 'Otp sent successfully'});
        }
    });
});

app.listen(port, () =>
    console.log(`Server started on port ${port}`)
);