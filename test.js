const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 465,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: 'ce81b5c8478fe9',
    pass: 'aa75d30149397b'
  }
});

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // sender address
    to: 'bar@example.com, baz@example.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

//main().catch(console.error);

// const speakeasy = require('speakeasy');
// exports.otpCode = () => {
//   // Generate a secret key with a length
//   // of 20 characters
//   const secret = speakeasy.generateSecret({ length: 20 });

//   // Generate a TOTP code using the secret key
//   const code = speakeasy.totp({
//     // Use the Base32 encoding of the secret key
//     secret: secret.base32,

//     // Tell Speakeasy to use the Base32
//     // encoding format for the secret key
//     encoding: 'base32'
//   });

//   // Log the secret key and TOTP code
//   // to the console
//   console.log('Secret: ', secret.base32);
//   console.log('Code: ', code);
// };
const signToken = id => {
  return jwt.sign({ id }, 'i love you', {
    expiresIn: '90d'
  });
};
//console.log(signToken('46164af6f5a6fag6'));
const hashedToken = crypto
  .createHash('sha256')
  .update('hellllllllllo')
  .digest('hex');
console.log(hashedToken);
