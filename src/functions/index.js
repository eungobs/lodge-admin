const functions = require('firebase-functions');
const cors = require('cors');
const express = require('express');
const app = express();

// Enable CORS
app.use(cors({ origin: true })); // You can specify your frontend URL here if needed

app.use(express.json()); // To parse JSON request bodies

// Your sendEmail function
app.post('/sendEmail', (req, res) => {
  const { email, emailType, message } = req.body;

  // Replace this comment with your email sending logic
  console.log('Email:', email);
  console.log('Email Type:', emailType);
  console.log('Message:', message);

  // Simulate successful email sending
  res.status(200).send('Email sent successfully!');
});

// Export the function
exports.sendEmail = functions.https.onRequest(app);

