// routes/admin/tasksRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../../connection');

// ➤ Obtenir toutes les tâches (absences et réservations en attente)
router.get('/tasks', (req, res) => {
  const sql = `
    SELECT id, type, motif AS reason, date_debut AS startDate, date_fin AS endDate, id_prof, id_salle,
           created_at, status
    FROM absence_reserve
    WHERE status = 'en attente'
    ORDER BY created_at DESC
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Erreur récupération des tâches :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.json(results);
  });
});

// ➤ Accepter ou refuser une tâche
router.post('/tasks/:id/:action', (req, res) => {
  const { id, action } = req.params;

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ message: "Action invalide." });
  }

  const newStatus = action === 'accept' ? 'validée' : 'refusée';
  const sql = `UPDATE absence_reserve SET status = ? WHERE id = ?`;

  connection.query(sql, [newStatus, id], (err, result) => {
    if (err) {
      console.error("❌ Erreur mise à jour tâche :", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tâche non trouvée." });
    }

    res.json({ message: `Tâche ${action === 'accept' ? 'validée' : 'refusée'}.` });
  });
});

module.exports = router;
