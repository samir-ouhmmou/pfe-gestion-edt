const connection = require('../../../connection');

async function chargerDonneesDepuisDB() {
  const configuration = {};

  configuration.professeurs = await new Promise((resolve, reject) => {
    connection.query('SELECT id_prof, nom FROM professeur', (err, results) => {
      if (err) return resolve([]);
      resolve(results.map(p => ({
        id: p.id_prof.toString(),
        nom: p.nom,
        indisponibilites: []
      })));
    });
  });

  configuration.salles = await new Promise((resolve, reject) => {
    connection.query('SELECT id_salle, nom FROM salle', (err, results) => {
      if (err) return resolve([]);
      resolve(results.map(s => ({
        id: s.id_salle.toString(),
        nom: s.nom
      })));
    });
  });

  configuration.classes= await new Promise((resolve, reject) => {
    connection.query('SELECT id_classe, nom FROM classe', (err, results) => {
      if (err) return resolve([]);
      resolve(results.map(c => ({
        id: c.id_classe.toString(),
        nom: c.nom
      })));
    });
  });

  configuration.matieres = await new Promise((resolve, reject) => {
    connection.query('SELECT id_matiere, nom, id_prof FROM matiere', (err, results) => {
      if (err) return resolve([]);
      resolve(results.map(m => ({
        id: m.id_matiere.toString(),
        nom: m.nom,
        professeur: m.id_prof.toString(),
        duree: 2
      })));
    });
  });

//   configuration.creneaux = await new Promise((resolve, reject) => {
//     connection.query('SELECT id_créneau, jour, h_début, h_fin FROM creneau', (err, results) => {
//       if (err) return resolve([]);
//       resolve(results.map(c => ({
//         id_créneau: c.id_créneau,
//         jour: c.jour,
//         h_début: c.h_début,
//         h_fin: c.h_fin
//       })));
//     });
//   });

//   return configuration;
// }
const creneaux = await new Promise((resolve, reject) => {
  connection.query('SELECT id_créneau, jour, h_début, h_fin FROM creneau', (err, results) => {
    if (err) {
      console.error("Erreur SQL (creneaux):", err);
      return resolve([]);
    }

    if (!results || results.length === 0) {
      console.log("⚠️ Aucun créneau trouvé !");
    }

    resolve(results.map(c => ({
      id_creneau: c.id_créneau,
      jour: c.jour,
      h_début: c.h_début,
      h_fin: c.h_fin
        })));
    });
    });

    if (creneaux.length > 0) {
    configuration.creneaux = creneaux;
    }
    return configuration;
}

module.exports = { chargerDonneesDepuisDB };
