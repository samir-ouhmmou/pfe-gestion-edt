const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRoute = require('./rootes/utilisateur');
const adminRoute = require('./rootes/admin/administrateur');
const profRoute = require('./rootes/prof/professeur');
const classeRoute = require('./rootes/admin/classe');
const salleRoute = require('./rootes/admin/salle');
const profsRoute = require('./rootes/admin/profs');
const app = express();

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173', // URL exacte de votre frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
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
app.use('/api/utilisateur', userRoute);
app.use('/api/administrateur', adminRoute);
app.use('/api/professeur', profRoute);
app.use('/api/classes',classeRoute);
app.use('/api/salles',salleRoute);
app.use('/api/profs',profsRoute);


const PORT = process.env.PORT || 8888;

// Exporter app pour server.js
module.exports = app;