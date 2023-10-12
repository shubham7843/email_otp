const express = require('express');
var bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const port = env.PORT || 3001;
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
    // Create a transporter using the Gmail SMTP server
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'rajan.reddy21@gmail.com',  // Replace with your Gmail email address
        pass: 'RajanReddy@21',        // Replace with your Gmail password or an App Password
        },
    });

    // Email data
    const mailOptions = {
        from: 'rajan.reddy21@gmail.com', // Your Gmail email address
        to: 'barsagadeshubham123@gmail.com', // Recipient's email address
        subject: 'Hello from Node.js',
        text: 'This is a test email sent from Node.js with nodemailer.',
    };
    
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        console.error('Error sending email:', error);
        } else {
        console.log('Email sent:', info.response);
        }
    });
    res.send('Hello, World!');
});

app.listen(port, () =>
    console.log(`Server started on port ${port}`)
);