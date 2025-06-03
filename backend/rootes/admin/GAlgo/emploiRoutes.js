// // rootes/admin/emploiRoutes.js
// const express = require('express');
// const router = express.Router();
// const connection = require('../../../connection');// adapte selon ta structure
// const { configurationExemple } = require('./edt');
// const { algorithmeGenetique } = require('./algorithme');

// // Route pour générer automatiquement l'emploi du temps

// async function getIdCreneau(jour, h_début, heureFin) {
//   const [rows] = await connection.execute(
//     `SELECT id_créneau FROM creneau WHERE jour = ? AND h_début = ? AND h_fin = ? LIMIT 1`,
//     [jour, `${heureDebut}:00`, `${heureFin}:00`]
//   );

//   if (rows.length === 0) {
//     throw new Error(`Créneau introuvable pour ${jour} ${heureDebut}:00-${heureFin}:00`);
//   }

//   return rows[0].id_créneau;
// }

// router.post('/generate', async (req, res) => {
    
//   try {
//     await connection.execute(`DELETE FROM seance`);
//     const meilleurEDT = algorithmeGenetique(configurationExemple, 100);

//     // Connexion à la base (séances générées dans meilleurEDT.seance)
//     const seances = meilleurEDT.seance;

//     for (const seance of seances) {
//       await connection.execute(
//         `INSERT INTO seance (date, id_prof, id_matiere, id_salle, id_créneau, id_classe, id_edt)
//          VALUES (?, ?, ?, ?, ?, ?, ?)`,
//         [
//           new Date(), // ou null si tu ne veux pas de date fixe
//           seance.professeur,
//           seance.matiere,
//           seance.salle,
//           await getIdCreneau(seance.jour, seance.heureDebut, seance.heureFin),
//           seance.groupe,
//           1 // ou null ou un id_edt fictif
//         ]
//       );
//     }

//     res.json({ success: true, message: 'Emploi du temps généré et enregistré.' });
//   } catch (error) {
//     console.error('Erreur lors de la génération/insertion :', error);
//     res.status(500).json({ message: 'Erreur lors de la génération ou insertion en base.' });
//   }
// });


// router.get('/:classId', async (req, res) => {
//   const { classId } = req.params;

//   try {
//     const [rows] = await connection.execute(`
//       SELECT 
//         c.jour,
//         c.h_début,
//         c.h_fin,
//         m.nom AS nom_matiere,
//         p.nom AS nom_prof,
//         s.nom AS nom_salle
//       FROM seance se
//       JOIN creneau c ON se.id_créneau = c.id_créneau
//       JOIN matiere m ON se.id_matiere = m.id_matiere
//       JOIN professeur p ON se.id_prof = p.id_prof
//       JOIN salle s ON se.id_salle = s.id_salle
//       WHERE se.id_classe = ?
//     `, [classId]);

//     const timetable = rows.map(row => ({
//       day: row.jour,
//       h_début: row.h_début,
//       h_fin: row.h_fin,
//       subject: row.nom_matiere,
//       teacherName: row.nom_prof,
//       roomName: row.nom_salle
//     }));

//     res.json(timetable);
//   } catch (error) {
//     console.error('Erreur lors de la récupération de l\'emploi du temps :', error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// });


// module.exports = router;
const express = require('express');
const router = express.Router();
const connection = require('../../../connection');
const { configurationExemple } = require('./edt');
// const { algorithmeGenetique } = require('./algorithme');
const { algorithmeGenetiqueAmeliore } = require('./algorithme');
const { chargerDonneesDepuisDB } = require('./dataLoader');

// Convertit un nombre décimal (ex: 8.5) en heure "08:30:00"
function formatHeure(decimal) {
  const heures = String(Math.floor(decimal)).padStart(2, '0');
  const minutes = String(Math.round((decimal % 1) * 60)).padStart(2, '0');
  return `${heures}:${minutes}:00`;
}

async function getIdCreneau(jour, h_debut, h_fin) {
  return new Promise((resolve, reject) => {
    // Normalisation des heures (format: HH:MM:SS)
    const formatHeure = (heure) => {
      if (!heure) return null;
      return typeof heure === 'string' && heure.length === 5 ? `${heure}:00` : heure;
    };

    const heureDebut = formatHeure(h_debut);
    const heureFin = formatHeure(h_fin);

    if (!heureDebut || !heureFin) {
      return reject(new Error(`Heure invalide : ${h_debut} - ${h_fin}`));
    }

    connection.query(
      `SELECT id_créneau FROM creneau 
       WHERE LOWER(jour) = LOWER(?) AND h_début = ? AND h_fin = ? 
       LIMIT 1`,
      [jour, heureDebut, heureFin],
      (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) {
          return reject(new Error(`Créneau introuvable pour ${jour} ${heureDebut}-${heureFin}`));
        }
        resolve(results[0].id_créneau);
      }
    );
  });
}



router.post('/generate', async (req, res) => {
  try {
    // Supprimer les anciennes séances
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM seance', (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Charger la configuration depuis la base de données
    const configFromDB = await chargerDonneesDepuisDB();

    if (
      !configFromDB.professeurs?.length ||
      !configFromDB.classes?.length ||
      !configFromDB.salles?.length ||
      !configFromDB.matieres?.length ||
      !configFromDB.creneaux?.length
    ) {
      return res.status(400).json({ success: false, message: "Configuration incomplète dans la base de données." });
    }

    // Générer l'emploi du temps
    const meilleurEDT = algorithmeGenetiqueAmeliore(configFromDB, 100);
    const seances = meilleurEDT.seance;

    for (const seance of seances) {
  try {
    const idCreneau = await getIdCreneau(seance.jour, seance.heureDebut, seance.heureFin);
    if (!idCreneau) {
      console.warn('Créneau non trouvé :', seance);
      continue;
    }

    await new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO seance (date, id_prof, id_matiere, id_salle, id_créneau, id_classe, id_edt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          new Date(),
          seance.professeur,
          seance.matiere,
          seance.salle,
          idCreneau,
          seance.classe,
          null
        ],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  } catch (error) {
    console.warn('Séance invalide ignorée :', seance);
    console.error(error.message);
  }
}


    res.json({ success: true, message: 'Emploi du temps généré et enregistré.' });
  } catch (error) {
    console.error('Erreur lors de la génération/insertion :', error);
    res.status(500).json({ message: 'Erreur lors de la génération ou insertion en base.' });
  }
});

router.get('/:classId', async (req, res) => {
  const { classId } = req.params;

  try {
    const rows = await new Promise((resolve, reject) => {
  connection.query(
    `SELECT 
      c.jour,
      c.h_début,
      c.h_fin,
      m.nom AS nom_matiere,
      m.id_matiere,
      p.nom AS nom_prof,
      p.prénom AS prénom_prof,
      p.id_prof,
      s.nom AS nom_salle,
      s.id_salle
    FROM seance se
    JOIN creneau c ON se.id_créneau = c.id_créneau
    JOIN matiere m ON se.id_matiere = m.id_matiere
    JOIN professeur p ON se.id_prof = p.id_prof
    JOIN salle s ON se.id_salle = s.id_salle
    WHERE se.id_classe = ?`,
    [classId], 
    (err, results) => {
      if (err) return reject(err);
      resolve(results);
    }
  );
});


    const timetable = rows.map(row => ({
  day: row.jour,
  startTime: row.h_début.toString().substring(0, 5),
  endTime: row.h_fin.toString().substring(0, 5),
  subject: row.nom_matiere,
  teacherName: row.nom_prof +' '+row.prénom_prof,
  roomName: row.nom_salle,
  teacherId: row.id_prof,
  roomId: row.id_salle
}));
res.json(timetable);

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'emploi du temps :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});



module.exports = router;
