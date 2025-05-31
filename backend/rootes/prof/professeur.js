const express = require('express');
const connection = require('../../../backend/connection');
const router = express.Router();
const bcrypt = require('bcrypt');
require('dotenv').config();

router.get('/by-email/:email', (req, res) => {
  const email = req.params.email;

  const sql = 'SELECT * FROM professeur WHERE email = ?';
  connection.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du professeur :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Professeur non trouvé' });
    }

    res.status(200).json(results[0]); // On retourne le professeur trouvé
  });
});


router.put('/update', (req, res) => {
  const oldEmail = req.query.email; // <-- email avant modification
  const { nom, prénom, email, telephone, spécialité } = req.body;

  if (!oldEmail || !nom || !prénom || !email || !telephone || !spécialité) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  // Vérifier si le professeur existe
  const selectQuery = "SELECT * FROM professeur WHERE email = ?";
  connection.query(selectQuery, [oldEmail], (err, result) => {
    if (err) return res.status(500).json({ message: "Erreur de base de données", error: err });

    if (result.length === 0) {
      return res.status(404).json({ message: "Aucun professeur trouvé avec cet email." });
    }

    // Mise à jour dans la table professeur
    const updateProfQuery = `
      UPDATE professeur 
      SET nom = ?, prénom = ?, email = ?, telephone = ?, spécialité = ? 
      WHERE email = ?
    `;
    const profValues = [nom, prénom, email, telephone, spécialité, oldEmail];

    connection.query(updateProfQuery, profValues, (err2, results2) => {
      if (err2) return res.status(500).json({ message: "Erreur lors de la mise à jour du professeur", error: err2 });

      // Mise à jour dans la table utilisateur
      const updateUserQuery = `
        UPDATE utilisateur 
        SET nom = ?, email = ?
        WHERE email = ?
      `;
      const userValues = [`${nom} ${prénom}`, email, oldEmail];

      connection.query(updateUserQuery, userValues, (err3, results3) => {
        if (err3) {
          return res.status(500).json({ message: "Prof mis à jour mais erreur utilisateur", error: err3 });
        }

        return res.status(200).json({ message: "Professeur et utilisateur mis à jour avec succès ✔ !!" });
      });
    });
  });
});


// Route pour changer le mot de passe
router.put('/update-password', async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  if (!email || !currentPassword || !newPassword) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    // Récupérer le mot de passe actuel
    const sql = "SELECT mot_de_passe FROM utilisateur WHERE email = ?";
    connection.query(sql, [email], async (err, results) => {
      if (err) return res.status(500).json({ message: "Erreur serveur" });

      if (results.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
      }

      const isMatch = bcrypt.compare(currentPassword, results[0].mot_de_passe);
      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe actuel incorrect." });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updateSql = "UPDATE utilisateur SET mot_de_passe = ? WHERE email = ?";
      connection.query(updateSql, [hashedPassword, email], (err2) => {
        if (err2) {
          return res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe dans utilisateur." });
        }

        // Mise à jour dans professeur
        const updateSql2 = "UPDATE professeur SET mot_de_pass = ? WHERE email = ?";
        connection.query(updateSql2, [hashedPassword, email], (err3) => {
          if (err3) {
             console.error("Erreur update professeur:", err3);
            return res.status(500).json({ message: "Mot de passe modifié dans utilisateur, mais erreur dans professeur.", error: err3 });
          }

          // Tout s’est bien passé
          return res.status(200).json({ message: "Mot de passe mis à jour avec succès dans les deux tables." });
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Erreur interne." });
  }
});

module.exports = router;
