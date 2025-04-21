const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRoute = require('./rootes/utilisateur');
const adminRoute = require('./rootes/administrateur');
const profRoute = require('./rootes/professeur');
const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use('/utilisateur', userRoute);
app.use('/administrateur', adminRoute);
app.use('/administrateur', profRoute);


const PORT = process.env.PORT || 8888;

// Exporter app pour server.js
module.exports = app;