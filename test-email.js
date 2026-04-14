const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to get variables
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim();
    }
});

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

console.log('Testing connection with:');
console.log('Host:', env.SMTP_HOST);
console.log('User:', env.SMTP_USER);
console.log('From:', env.SMTP_FROM);

transporter.verify(function (error, success) {
    if (error) {
        console.error('Verification failed:');
        console.error(error);
    } else {
        console.log('Server is ready to take our messages');
        
        // Optional: Send a test mail to the owner themselves to verify it works
        const mailOptions = {
            from: `"${env.PORTFOLIO_OWNER_NAME}" <${env.SMTP_FROM || env.SMTP_USER}>`,
            to: env.SMTP_USER, // Send to self
            subject: 'SMTP Connection Test',
            text: 'This is a test email to verify SMTP configuration.',
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending test email:', err);
            } else {
                console.log('Test email sent successfully:', info.response);
            }
        });
    }
});
