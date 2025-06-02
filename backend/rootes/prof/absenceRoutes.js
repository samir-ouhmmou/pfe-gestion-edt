// rootes/prof/absenceRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../../connection');

// ➤ Ajouter une absence
router.post('/', (req, res) => {
  const { startDate, endDate, reason, id_prof } = req.body;

  if (!startDate || !endDate || !reason || !id_prof) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  // Validation des dates
  if (new Date(startDate) > new Date(endDate)) {
    return res.status(400).json({ message: "La date de début doit être avant la date de fin." });
  }
  const date=new Date();
  const sql = `
    INSERT INTO absence_reserve (date,date_debut, date_fin, type, motif, status, created_at, id_prof)
    VALUES (?,?, ?, 'absence', ?, 'en attente', NOW(), ?)
  `;

  connection.query(sql, [date,startDate, endDate, reason, id_prof], (err, results) => {
    if (err) {
      console.error("❌ Erreur insertion absence:", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.status(201).json({ message: "Absence enregistrée avec succès." });
  });
});

// ➤ Récupérer les absences d’un professeur
router.get('/:id_prof', (req, res) => {
  const { id_prof } = req.params;

  const sql = `
    SELECT id, date_debut AS startDate, date_fin AS endDate, motif AS reason, status, created_at AS createdAt
    FROM absence_reserve
    WHERE id_prof = ? AND type = 'absence'
    ORDER BY created_at DESC
  `;

  connection.query(sql, [id_prof], (err, results) => {
    if (err) {
      console.error("❌ Erreur récupération absences:", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.json(results);
  });
});

// ➤ Supprimer une absence en attente
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM absence_reserve
    WHERE id = ? AND status = 'en attente'
  `;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Erreur suppression absence:", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Absence non trouvée ou non supprimable." });
    }

    res.json({ message: "Absence supprimée avec succès." });
  });
});

module.exports = router;
