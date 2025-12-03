const express = require('express');
const bodyParser = require('body-parser');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = express();
app.use(bodyParser.json());

let user = {}; // In real use, store in a database

// Generate a new 2FA secret and return the QR code URL
app.get('/generate-2fa', async (req, res) => {
  const secret = speakeasy.generateSecret({
    name: 'MyApp (user@example.com)',
  });

  // Save the secret for this user
  user.temp_secret = secret;

  // Generate QR code image URL
  const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url);

  res.json({
    message: 'Scan the QR code with Google Authenticator or Authy',
    qrCodeDataURL,
    secret: secret.base32, // Display for testing; don't expose in production
    secretFull:secret
  });
});

// Verify the token provided by the user
app.get('/verify-2fa', (req, res) => {
  const { token } = req.query;

  const verified = speakeasy.totp.verify({
    secret: user.temp_secret.base32,
    encoding: 'base32',
    token,
    window: 1, // Allow 30-sec drift
  });

  if (verified) {
    user.secret = user.temp_secret;
    delete user.temp_secret;
    res.json({ verified: true, message: '2FA enabled successfully!' });
  } else {
    res.json({ verified: false, message: 'Invalid token. Try again.' });
  }
});

// Login verification route (after 2FA setup)
app.post('/validate-2fa', (req, res) => {
  const { token } = req.body;

  const verified = speakeasy.totp.verify({
    secret: user.secret.base32,
    encoding: 'base32',
    token,
    window: 1,
  });

  if (verified) {
    res.json({ success: true, message: '2FA login successful!' });
  } else {
    res.json({ success: false, message: 'Invalid 2FA code.' });
  }
});

app.listen(3000, () => console.log('2FA server running on http://localhost:3000'));
