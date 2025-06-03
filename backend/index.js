require('dotenv').config(); // 🔐 pour charger JWT_SECRET
const express = require('express');
var cors = require('cors');
const connection = require('./connection');
const userRoute = require('./rootes/utilisateur');
const adminRoute = require('./rootes/admin/administrateur');
const profRoute = require('./rootes/prof/professeur');
const classeRoute = require('./rootes/admin/classe');
const salleRoute = require('./rootes/admin/salle');
const profsRoute = require('./rootes/admin/profs');
const niveauRoute = require('./rootes/admin/Niveau');
const absenceRoute = require('./rootes/prof/absenceRoutes');
const reservationRoute = require('./rootes/prof/reservationRoutes');
const tasksRoutes = require('./rootes/admin/tasksRoutes');
const statistics = require('./rootes/admin/statistics');
const emploiRoute = require('./rootes/admin/GAlgo/emploiRoutes');

const app = express();
const jwt = require('jsonwebtoken');

// Middleware
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Middleware d'authentification amélioré
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: "Token non fourni" });
  }

  jwt.verify(token, process.env.ACCES_TOKEN, (err, user) => {
    if (err) {
      console.error("Erreur de vérification du token:", err);
      return res.status(403).json({ message: "Token invalide ou expiré" });
    }
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
app.use('/api/classes', classeRoute);
app.use('/api/salles', salleRoute);
app.use('/api/profs', profsRoute);
app.use('/api/niveau', niveauRoute);
app.use('/api/absence', absenceRoute); 
app.use('/api/reservation', reservationRoute);
app.use('/api/admin', tasksRoutes);
app.use('/api/statistics',statistics);
app.use('/api/emploi', emploiRoute);
const PORT = process.env.PORT || 8888;

module.exports = app;