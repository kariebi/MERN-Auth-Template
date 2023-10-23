const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const sendOTPEmail = async (email, token) => {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });


    const htmlTemplate = `
        <html>
        <body style="text-align: center; max-width:100%; font-family: Arial, sans-serif;">
    
            <h1 style="color: #333;">MERN Auth Template</h1>
    
            <p>Your one-time Email verification code is:</p>
    
            <h2 style="color: #333; font-size: 24px;">${token}</h2>
    
            <p>Copy the link and Paste it to verify the Email</p>
    
            <div style="margin-top: 20px;">
                <p style="font-size: 14px; color: #666;">Developed by Kariebi</p>
            </div>
        </body>
    </html>    
        `;


    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Verify Your Email',
      html: htmlTemplate,
    };


    const result = await transporter.sendMail(mailOptions);

    console.log('Email sent:', result);


    return 'Verification email sent successfully';
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};


const comparePassword = (password, hash) => {
  return bcrypt.compare(password, hash);
};


const generateRandomToken = () => {
  const min = 100000;
  const max = 999999;

  const randomToken = Math.floor(Math.random() * (max - min + 1)) + min;

  return randomToken.toString();
};


module.exports = {
  sendOTPEmail,
  generateRandomToken,
  hashPassword,
  comparePassword,
};
