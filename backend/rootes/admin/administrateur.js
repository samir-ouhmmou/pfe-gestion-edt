const express = require('express');
const connection = require('../../../backend/connection');
const router = express.Router();
require('dotenv').config();

// Import des modules de l'algorithme génétique
const AlgorithmeGenetique = require('./GAlgo/algorithme');
const { EmploiDuTemps, configurationExemple } = require('./GAlgo/edt');
const criteres = require('./GAlgo/critiries');

// Fonction pour générer l'emploi du temps avec l'algorithme génétique
async function genererEmploiDuTemps(configuration, options = {}) {
  console.log("Démarrage de la génération d'emploi du temps...");
  
  // Paramètres de l'algorithme génétique
  const parametres = {
    taillePopulation: options.taillePopulation || 50,
    tauxMutation: options.tauxMutation || 0.2,
    tauxCroisement: options.tauxCroisement || 0.8,
    nombreGenerations: options.nombreGenerations || 200,
    elitisme: options.elitisme !== undefined ? options.elitisme : true,
    nombreElites: options.nombreElites || 2
  };
  
  // Créer l'algorithme génétique
  const algo = new AlgorithmeGenetique(parametres);
  
  // Fonction de génération d'un emploi du temps aléatoire
  const generateur = () => EmploiDuTemps.genererAleatoire(configuration);
  
  // Initialiser la population
  console.log("Initialisation de la population initiale...");
  algo.initialiserPopulation(generateur);
  
  // Exécuter l'algorithme
  console.log(`Exécution de l'algorithme pour ${parametres.nombreGenerations} générations...`);
  const meilleureSolution = algo.executer(generateur);
  
  // Statistiques
  const stats = algo.getStatistiques();
  
  return {
    emploiDuTemps: meilleureSolution.edt,
    planningFormate: meilleureSolution.edt.formaterPourAffichage(),
    fitness: meilleureSolution.fitness,
    estValide: criteres.estValide(meilleureSolution.edt),
    statistiques: stats
  };
}

// Fonction pour récupérer les données nécessaires depuis la base de données
async function chargerDonneesDepuisDB() {
  try {
    // Utiliser la configuration d'exemple par défaut
    // En cas d'erreur avec la base de données
    const configuration = { ...configurationExemple };
    
    try {
      // Récupérer les professeurs
      const professeurs = await new Promise((resolve, reject) => {
        connection.query('SELECT id_prof, nom FROM professeur', (err, results) => {
          if (err) {
            console.error("Erreur SQL (professeurs):", err);
            resolve([]);
          } else if (!results || results.length === 0) {
            console.log("Aucun professeur trouvé dans la base de données");
            resolve([]);
          } else {
            resolve(results.map(p => ({ 
              id: p.id_prof.toString(), // Uniformiser avec 'id' pour la cohérence
              id_prof: p.id_prof.toString(), 
              nom: p.nom,
              indisponibilites: [] 
            })));
          }
        });
      });
      
      if (professeurs.length > 0) {
        configuration.professeurs = professeurs;
      }
      
      // Récupérer les salles
      const salles = await new Promise((resolve, reject) => {
        connection.query('SELECT id_salle, capacité FROM salle', (err, results) => {
          if (err) {
            console.error("Erreur SQL (salles):", err);
            resolve([]);
          } else if (!results || results.length === 0) {
            console.log("Aucune salle trouvée dans la base de données");
            resolve([]);
          } else {
            resolve(results.map(s => ({ 
              id: s.id_salle.toString(), // Uniformiser avec 'id' pour la cohérence
              id_salle: s.id_salle.toString(), 
              nom: s.nom || `Salle ${s.id_salle}`,
              capacite: s.capacité || 30
            })));
          }
        });
      });
      
      if (salles.length > 0) {
        configuration.salles = salles;
      }
      
      // Récupérer les classes (groupes)
      const groupes = await new Promise((resolve, reject) => {
        connection.query('SELECT id_classe, nom, nbr_élèves FROM classe', (err, results) => {
          if (err) {
            console.error("Erreur SQL (classe):", err);
            resolve([]);
          } else if (!results || results.length === 0) {
            console.log("Aucune classe trouvée dans la base de données");
            resolve([]);
          } else {
            resolve(results.map(g => ({ 
              id: g.id_classe.toString(), 
              id_classe: g.id_classe.toString(),
              nom: g.nom,
              effectif: g.nbr_élèves || 20 
            })));
          }
        });
      });
      
      if (groupes.length > 0) {
        configuration.groupe = groupes; // Correction: groupe au lieu de classe
      }
      
      // Récupérer les matières
      const matieres = await new Promise((resolve, reject) => {
        connection.query('SELECT id_matiere, nom, id_prof FROM matiere', (err, results) => {
          if (err) {
            console.error("Erreur SQL (matières):", err);
            resolve([]);
          } else if (!results || results.length === 0) {
            console.log("Aucune matière trouvée dans la base de données");
            resolve([]);
          } else {
            resolve(results.map(m => ({ 
              id: m.id_matiere.toString(),
              id_matiere: m.id_matiere.toString(),
              nom: m.nom,
              professeur: m.id_prof ? m.id_prof.toString() : null,
              duree: 2
            })));
          }
        });
      });
      
      if (matieres.length > 0) {
        configuration.matieres = matieres;
      }
      
      // Récupérer les créneaux
      const creneaux = await new Promise((resolve, reject) => {
        connection.query('SELECT id_créneau, jour, h_début, h_fin FROM creneau', (err, results) => {
          if (err) {
            console.error("Erreur SQL (creneaux):", err);
            resolve([]);
          } else if (!results || results.length === 0) {
            console.log("Aucun creneau trouvé dans la base de données");
            resolve([]);
          } else {
            resolve(results.map(c => ({
              id: c.id_créneau.toString(),
              id_creneau: c.id_créneau.toString(),
              jour: c.jour,
              heureDebut: parseInt(c.h_début),
              heureFin: parseInt(c.h_fin)
            })));
          }
        });
      });

      if (creneaux.length > 0) {
        configuration.creneaux = creneaux;
      }
      
    } catch (dbError) {
      console.error("Erreur lors de l'accès à la base de données:", dbError);
      console.log("Utilisation de la configuration d'exemple...");
    }
    
    return configuration;
  } catch (error) {
    console.error('Erreur globale lors du chargement des données:', error);
    // En cas d'erreur, retourner la configuration d'exemple
    return configurationExemple;
  }
}

// Sauvegarder l'emploi du temps généré dans la base de données
async function sauvegarderEmploiDuTemps(emploiDuTemps) {
  try {
    // Vérifier si la table seance existe
    const tableExists = await new Promise((resolve, reject) => {
      connection.query("SHOW TABLES LIKE 'seance'", (err, results) => {
        if (err) {
          console.error("Erreur lors de la vérification de la table seance:", err);
          resolve(false);
        } else {
          resolve(results.length > 0);
        }
      });
    });
    
    if (!tableExists) {
      console.error("La table 'seance' n'existe pas dans la base de données");
      return false;
    }
    
    // Supprimer les anciens seances
    await new Promise((resolve, reject) => {
      connection.query('DELETE FROM seance', (err, results) => {
        if (err) {
          console.error("Erreur lors de la suppression des anciens seances:", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
    
    // Insérer les nouveaux seances
    for (const seance of emploiDuTemps.seance) {
      try {
        // Déterminer le créneau horaire approprié si les créneaux existent
        let idCreneau = null;
        if (emploiDuTemps.creneaux && emploiDuTemps.creneaux.length > 0) {
          // Rechercher un créneau correspondant au jour et aux heures
          const creneauTrouve = emploiDuTemps.creneaux.find(c => 
            c.jour === seance.jour && 
            c.heureDebut <= seance.heureDebut && 
            c.heureFin >= seance.heureFin
          );
          
          if (creneauTrouve) {
            idCreneau = creneauTrouve.id_creneau;
          }
        }
        
        await new Promise((resolve, reject) => {
          // Adaptez cette requête selon la structure exacte de votre table seance
          const query = idCreneau 
            ? 'INSERT INTO seance (id_matiere, id_professeur, id_salle, id_classe, jour, id_creneau) VALUES (?, ?, ?, ?, ?, ?)'
            : 'INSERT INTO seance (id_matiere, id_professeur, id_salle, id_classe, jour, heure_debut, heure_fin) VALUES (?, ?, ?, ?, ?, ?, ?)';
          
          const params = idCreneau 
            ? [seance.matiere, seance.professeur, seance.salle, seance.groupe, seance.jour, idCreneau]
            : [seance.matiere, seance.professeur, seance.salle, seance.groupe, seance.jour, seance.heureDebut, seance.heureFin];
          
          connection.query(query, params, (err, results) => {
            if (err) {
              console.error("Erreur lors de l'insertion d'une séance:", err);
              // Continue malgré l'erreur
              resolve(false);
            } else {
              resolve(true);
            }
          });
        });
      } catch (seanceError) {
        console.error('Erreur lors du traitement d\'une séance:', seanceError);
        // Continue avec la prochaine séance
      }
    }
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde de l\'emploi du temps:', error);
    return false;
  }
}

// Route pour générer automatiquement un emploi du temps
router.get('/generate-automatic', async (req, res) => {
  try {
    console.log("Traitement de la requête de génération d'emploi du temps...");
    
    // Récupérer les paramètres optionnels depuis la requête
    const options = {
      taillePopulation: parseInt(req.query.population) || 50,
      tauxMutation: parseFloat(req.query.mutation) || 0.2,
      tauxCroisement: parseFloat(req.query.croisement) || 0.8,
      nombreGenerations: parseInt(req.query.generations) || 100
    };
    
    console.log("Options utilisées:", options);
    
    // Charger les données depuis la base de données
    console.log("Chargement des données...");
    const configuration = await chargerDonneesDepuisDB();
    
    // Log de la configuration
    console.log(`Configuration chargée: ${configuration.professeurs.length} professeurs, ${configuration.salles.length} salles, ${configuration.groupe.length} groupes, ${configuration.matieres.length} matières`);
    
    // Générer l'emploi du temps
    console.log("Génération de l'emploi du temps...");
    const resultat = await genererEmploiDuTemps(configuration, options);
    
    // Sauvegarder l'emploi du temps dans la base de données si demandé
    let sauvegarde = false;
    if (req.query.save === 'true') {
      console.log("Sauvegarde de l'emploi du temps dans la base de données...");
      sauvegarde = await sauvegarderEmploiDuTemps(resultat.emploiDuTemps);
    }
    
    // Renvoyer le résultat
    res.status(200).json({
      success: true,
      message: "Emploi du temps généré avec succès" + (sauvegarde ? " et sauvegardé" : ""),
      data: {
        planningFormate: resultat.planningFormate,
        fitness: resultat.fitness,
        estValide: resultat.estValide,
        statistiques: {
          nombreGenerations: resultat.statistiques.generation,
          fitnessInitial: resultat.statistiques.meilleuresSolutions[0]?.fitness || 0,
          fitnessFinal: resultat.statistiques.meilleuresSolutions[resultat.statistiques.meilleuresSolutions.length - 1]?.fitness || 0
        },
        sauvegardeDansDB: sauvegarde
      }
    });
  } catch (error) {
    console.error('Erreur dans la génération de l\'emploi du temps:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la génération de l'emploi du temps",
      error: error.message
    });
  }
});

// Route pour afficher les paramètres disponibles
router.get('/params', (req, res) => {
  res.status(200).json({
    success: true,
    parametres: {
      population: "Taille de la population (défaut: 50)",
      mutation: "Taux de mutation entre 0 et 1 (défaut: 0.2)",
      croisement: "Taux de croisement entre 0 et 1 (défaut: 0.8)",
      generations: "Nombre de générations à exécuter (défaut: 100)",
      save: "Enregistrer l'emploi du temps dans la base de données (true/false)"
    },
    exempleUtilisation: "/api/admin/generate-automatic?population=100&generations=100&save=true"
  });
});

// Ajout d'une route pour récupérer la configuration actuelle
router.get('/configuration', async (req, res) => {
  try {
    const configuration = await chargerDonneesDepuisDB();
    res.status(200).json({
      success: true,
      data: {
        professeurs: configuration.professeurs.length,
        salles: configuration.salles.length,
        groupes: configuration.groupe.length,
        matieres: configuration.matieres.length,
        creneaux: configuration.creneaux ? configuration.creneaux.length : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de la configuration",
      error: error.message
    });
  }
});

module.exports = router;