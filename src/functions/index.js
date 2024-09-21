const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

exports.sendEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // Your email sending logic here
    const { email, type, message } = req.body;

    // Make sure to handle POST requests
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }

    // Proceed with email sending logic...

    res.status(200).send('Email sent successfully!');
  });
});

