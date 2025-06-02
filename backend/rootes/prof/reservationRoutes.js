// routes/prof/reservationRoutes.js
const express = require('express');
const router = express.Router();
const connection = require('../../connection');

// ➤ Ajouter une réservation
router.post('/', (req, res) => {
  const { startDate, endDate, startTime, endTime, reason, room, id_prof } = req.body;

  if (!startDate || !endDate || !startTime || !endTime || !reason || !room || !id_prof) {
    return res.status(400).json({ message: "Champs requis manquants." });
  }

  const date = new Date();
  const startDatetime = `${startDate} ${startTime}`;
  const endDatetime = `${endDate} ${endTime}`;

  if (new Date(startDatetime) > new Date(endDatetime)) {
    return res.status(400).json({ message: "La date/heure de début doit être avant la date/heure de fin." });
  }

  const sql = `
    INSERT INTO absence_reserve (date, date_debut, date_fin, type, motif, status, created_at, id_prof, id_salle)
    VALUES (?, ?, ?, 'reservation', ?, 'en attente', NOW(), ?, ?)
  `;

  connection.query(sql, [date, startDatetime, endDatetime, reason, id_prof, room], (err, results) => {
    if (err) {
      console.error("❌ Erreur insertion réservation:", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.status(201).json({ message: "Réservation enregistrée avec succès." });
  });
});

// ➤ Récupérer les réservations d’un professeur
router.get('/:id_prof', (req, res) => {
  const { id_prof } = req.params;

  const sql = `
    SELECT id, date_debut AS startDate, date_fin AS endDate, motif AS reason, status, created_at AS createdAt, id_salle AS room
    FROM absence_reserve
    WHERE id_prof = ? AND type = 'reservation'
    ORDER BY created_at DESC
  `;

  connection.query(sql, [id_prof], (err, results) => {
    if (err) {
      console.error("❌ Erreur récupération réservations:", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    res.json(results);
  });
});

// ➤ Supprimer une réservation en attente
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM absence_reserve
    WHERE id = ? AND status = 'en attente' AND type = 'reservation'
  `;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      console.error("❌ Erreur suppression réservation:", err);
      return res.status(500).json({ message: "Erreur serveur." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Réservation non trouvée ou non supprimable." });
    }

    res.json({ message: "Réservation supprimée avec succès." });
  });
});

module.exports = router;
