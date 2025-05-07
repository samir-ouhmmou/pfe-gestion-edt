const express = require('express');
const connection = require('../connection');
const router = express.Router();
const validator =require('validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const nodeMailer = require('nodemailer');
require('dotenv').config();


// login api working with succes
router.post('/login', (req, res) => {
    const utilisateur = req.body;
    
    // nvérifier wach hadchi bhal bhal 
    if (!utilisateur.email || !utilisateur.mot_de_passe) {
        return res.status(400).json({ message: "L'email et le mot de passe sont requis" });
    }
    
    query = "SELECT email, mot_de_passe, nom, role FROM utilisateur WHERE email = ?";
    connection.query(query, [utilisateur.email], (err, results) => {
        if (err) {
            return res.status(500).json(err);
        }
        
        if (results.length <= 0) {
            return res.status(401).json({message: "Email ou mot de passe incorrect"});
        } 
        
        if (results[0].mot_de_passe === utilisateur.mot_de_passe) {
            const response = {email: results[0].email, role: results[0].role};
            const accestoken = jwt.sign(response, process.env.ACCES_TOKEN, {expiresIn: '10h'});
            return res.status(200).json({token: accestoken});

        } else {
            return res.status(401).json({message: "Email ou mot de passe incorrect"});
        }
    });
});
// Configuration du transporteur email
var transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

// Vérifier la config email
transporter.verify(function(error, success) {
    if (error) {
        console.log("Erreur de configuration email:", error);
    } else {
        console.log("Serveur prêt à envoyer des emails");
    }
});

// Pour la partie mot de passe oublié
router.post('/forgotpassword', async (req, res) => {
    const { email } = req.body;
  
    // Validation des entrée
    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Format email invalide' });
    }
  
    //khasso ikhtar wahd fihom 
    // if (!['professeur', 'administrateur'].includes(role)) {
    //   return res.status(400).json({ message: 'Rôle invalide. Choisissez un rôle valide.' });
    // }
  
    try {
      // Vérification de l'utilisateur
      const [utilisateurs] = await connection.promise().query(
        'SELECT id_utilisateur, email FROM utilisateur WHERE email = ?', 
        [email]
      );
  
      if (utilisateurs.length === 0) {
        return res.status(404).json({ message: 'Aucun compte trouvé avec ces identifiants' });
      }
      
      const utilisateur = utilisateurs[0];
  
      // Generate du token 
      const resetToken = crypto.randomBytes(20).toString('hex');
      const tokenExpiry = new Date(Date.now() + 3600000); // 1 h d'exp
  
      await connection.promise().query(
        'UPDATE utilisateur SET reset_token = ?, token_expiration = ? WHERE id_utilisateur = ?',
        [resetToken, tokenExpiry, utilisateur.id_utilisateur]
      );
  
      // Envoi d'un lien de réinitialisation 
      const resetLink = `http://localhost:8888/api/utilisateur/resetpassword?token=${resetToken}`;
      
      await transporter.sendMail({
        from: `"NAWABIGH" <${process.env.EMAIL}>`,
        to: email,
        subject: 'Réinitialisation de mot de passe',
        html: `
          <p><b>NAWABIGH - Réinitialisation de mot de passe</b></p>
          <p>Cliquez sur ce lien pour réinitialiser votre mot de passe :</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>Le lien expirera dans 1 heure.</p>
        `
      });
  
      return res.status(200).json({ message: 'Lien de réinitialisation envoyé a votre email' });
  
    } catch (err) {
      console.error('Erreur:', err);
      return res.status(500).json({ 
        message: 'Erreur serveur', 
        details: process.env.NODE_ENV === 'development' ? err.message : null
      });
    }
});

// reset password
router.post('/resetpassword', async (req, res) => {
  const  {newPassword} = req.body ;
  let token = req.query.token;
  // Validation des entrées
  if (!token || !newPassword) {
    return res.status(400).json({ 
      message: 'Token et mot de passe requis' 
    });
  }

  try {
    // Vérify token  apartir du basedonnée
    const [utilisateurs] = await connection.promise().query(
      'SELECT id_utilisateur, token_expiration FROM utilisateur WHERE reset_token = ?',
      [token]
    );

    // Vérifier si le token existe
    if (utilisateurs.length === 0) {
      return res.status(404).json({ message: 'Token invalide' });
    }

    const utilisateur = utilisateurs[0];

    // Vérifier si le token a expiré
    if (new Date(utilisateur.token_expiration) < new Date()) {
      await connection.promise().query(
        'UPDATE utilisateur SET reset_token = NULL, token_expiration = NULL WHERE id_utilisateur = ?',
        [utilisateur.id_utilisateur]
      );
      return res.status(410).json({ message: 'Token expiré' });
    }

    // Haché neww mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Mise ajoure mot pass bd
    await connection.promise().query(
      'UPDATE utilisateur SET mot_de_passe = ?, reset_token = NULL, token_expiration = NULL WHERE id_utilisateur = ?',
      [hashedPassword, utilisateur.id_utilisateur]
    );

    const [userInfo] = await connection.promise().query(
      'SELECT role FROM utilisateur WHERE id_utilisateur = ?',
      [utilisateur.id_utilisateur]
    );
    
    if (userInfo.length > 0) {
      const role = userInfo[0].role;
      
      if (role === 'professeur') {
        await connection.promise().query(
          'UPDATE professeur SET mot_de_pass = ? WHERE user_id = ?',
          [hashedPassword, utilisateur.id_utilisateur]
        );
      } else if (role === 'administrateur') {
        await connection.promise().query(
          'UPDATE administrateur SET mot_de_pass = ? WHERE user_id = ?',
          [hashedPassword, utilisateur.id_utilisateur]
        );
      }
    }

    return res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });

  } catch (err) {
    console.error('Erreur:', err);
    return res.status(500).json({ 
      message: 'Erreur serveur',
      details: process.env.NODE_ENV === 'development' ? err.message : null
    });
  }
});
module.exports =router;
