// const { EmploiDuTemps } = require('./edt');
// const { evaluerFitness, estValide } = require('./critiries');

// const genererPopulationInitiale = (taille, config) => {
//   const population = [];
//   console.log(`Génération de ${taille} emplois du temps...`);
  
//   for (let i = 0; i < taille; i++) {
//     const edt = EmploiDuTemps.genererAleatoire(config);
//     const stats = edt.verifierCompletude();
//     console.log(`EDT ${i + 1}: ${stats.totalSeancesCreees}/${stats.totalSeancesAttendues} séances`);
//     population.push(edt);
//   }
  
//   return population;
// };

// const selectionner = (population) => {
//   return population
//     .map(edt => {
//       const fitness = evaluerFitness(edt);
//       const stats = edt.verifierCompletude();
      
//       // Bonus pour la complétude
//       const completudeBonusRatio = stats.totalSeancesCreees / stats.totalSeancesAttendues;
//       const fitnessAjuste = fitness * (0.5 + completudeBonusRatio * 0.5);
      
//       return { 
//         edt, 
//         fitness: fitnessAjuste,
//         completude: completudeBonusRatio,
//         seances: stats.totalSeancesCreees 
//       };
//     })
//     .sort((a, b) => {
//       // Prioriser d'abord la complétude, puis le fitness
//       if (Math.abs(a.completude - b.completude) > 0.1) {
//         return b.completude - a.completude;
//       }
//       return b.fitness - a.fitness;
//     })
//     .slice(0, Math.min(10, population.length))
//     .map(p => p.edt);
// };

// const croisement = (parent1, parent2) => {
//   const enfant = new EmploiDuTemps();
//   enfant.professeurs = parent1.professeurs;
//   enfant.classes = parent1.classes;
//   enfant.salles = parent1.salles;
//   enfant.matieres = parent1.matieres;
//   enfant.creneaux = parent1.creneaux;

//   // Stratégie de croisement améliorée
//   const seancesParClasse = {};
  
//   // Grouper les séances par classe
//   [...parent1.seance, ...parent2.seance].forEach(seance => {
//     if (!seancesParClasse[seance.classe]) {
//       seancesParClasse[seance.classe] = [];
//     }
//     seancesParClasse[seance.classe].push(seance);
//   });

//   // Pour chaque classe, prendre les meilleures séances des deux parents
//   Object.keys(seancesParClasse).forEach(classeId => {
//     const seances = seancesParClasse[classeId];
    
//     // Supprimer les doublons de matières pour cette classe
//     const matieresVues = new Set();
//     const seancesUniques = seances.filter(seance => {
//       if (matieresVues.has(seance.matiere)) {
//         return false;
//       }
//       matieresVues.add(seance.matiere);
//       return true;
//     });

//     // Ajouter les séances sans conflit
//     seancesUniques.forEach(seance => {
//       if (!enfant.verifierConflits(seance)) {
//         enfant.seance.push(seance);
//       }
//     });
//   });

//   return enfant;
// };

// const mutation = (edt, config) => {
//   if (edt.seance.length === 0) return edt;

//   const mutationProb = 0.1;
//   const stats = edt.verifierCompletude();
  
//   // Si l'EDT est incomplet, essayer d'ajouter des séances manquantes
//   if (stats.matieresManquantes.length > 0 && Math.random() < 0.7) {
//     return ajouterSeanceManquante(edt, config);
//   }

//   // Mutation classique: modifier une séance existante
//   if (Math.random() < mutationProb) {
//     const index = Math.floor(Math.random() * edt.seance.length);
//     const ancienneSeance = edt.seance[index];
    
//     // Essayer de déplacer la séance vers un autre créneau
//     const nouveauxCreneaux = edt.creneaux.filter(c => 
//       c.jour !== ancienneSeance.jour || c.h_début !== ancienneSeance.heureDebut
//     );
    
//     if (nouveauxCreneaux.length > 0) {
//       const nouveauCreneau = nouveauxCreneaux[Math.floor(Math.random() * nouveauxCreneaux.length)];
      
//       const nouvelleSeance = {
//         ...ancienneSeance,
//         jour: nouveauCreneau.jour,
//         heureDebut: nouveauCreneau.h_début,
//         heureFin: nouveauCreneau.h_fin,
//         id_creneau: nouveauCreneau.id_créneau
//       };

//       // Supprimer l'ancienne séance temporairement
//       edt.seance.splice(index, 1);
      
//       // Essayer d'ajouter la nouvelle
//       if (!edt.verifierConflits(nouvelleSeance)) {
//         edt.seance.push(nouvelleSeance);
//       } else {
//         // Remettre l'ancienne si conflit
//         edt.seance.splice(index, 0, ancienneSeance);
//       }
//     }
//   }

//   return edt;
// };

// const ajouterSeanceManquante = (edt, config) => {
//   const stats = edt.verifierCompletude();
  
//   // Choisir une classe qui a des matières manquantes
//   for (const classe of edt.classes) {
//     const classeId = classe.id_classe || classe.id;
//     const statsClasse = stats.seancesParClasse[classe.nom];
    
//     if (statsClasse && statsClasse.manquantes.length > 0) {
//       // Choisir une matière manquante au hasard
//       const matiereManquanteNom = statsClasse.manquantes[
//         Math.floor(Math.random() * statsClasse.manquantes.length)
//       ];
      
//       const matiere = edt.matieres.find(m => m.nom === matiereManquanteNom);
//       if (!matiere) continue;

//       // Trouver le professeur
//       const prof = edt.professeurs.find(p =>
//         p.id === matiere.professeur || p.id_prof === matiere.professeur
//       );
//       if (!prof) continue;

//       // Choisir une salle
//       const salle = edt.choisirSalle(matiere);
//       if (!salle) continue;

//       // Essayer de trouver un créneau libre
//       const creneauxLibres = edt.creneaux.filter(creneau => {
//         const testSeance = {
//           classe: classeId,
//           professeur: prof.id_prof || prof.id,
//           salle: salle.id_salle || salle.id,
//           jour: creneau.jour,
//           heureDebut: creneau.h_début,
//           heureFin: creneau.h_fin
//         };
//         return !edt.verifierConflits(testSeance);
//       });

//       if (creneauxLibres.length > 0) {
//         const creneauChoisi = creneauxLibres[Math.floor(Math.random() * creneauxLibres.length)];
        
//         edt.ajouterSeance({
//           id: `seance_mutation_${Date.now()}`,
//           matiere: matiere.id_matiere || matiere.id,
//           professeur: prof.id_prof || prof.id,
//           salle: salle.id_salle || salle.id,
//           classe: classeId,
//           jour: creneauChoisi.jour,
//           heureDebut: creneauChoisi.h_début,
//           heureFin: creneauChoisi.h_fin,
//           id_creneau: creneauChoisi.id_créneau
//         });

//         console.log(`✓ Séance ajoutée par mutation: ${classe.nom} - ${matiere.nom}`);
//         break;
//       }
//     }
//   }

//   return edt;
// };

// const algorithmeGenetique = (config, generations = 50) => {
//   console.log(`=== Démarrage de l'algorithme génétique ===`);
//   console.log(`Générations: ${generations}`);
//   console.log(`Classes: ${config.classes?.length || 0}`);
//   console.log(`Matières: ${config.matieres?.length || 0}`);
//   console.log(`Créneaux: ${config.creneaux?.length || 0}`);

//   let population = genererPopulationInitiale(20, config); // Réduire la taille pour plus d'efficacité
//   let meilleurEdt = null;
//   let meilleurScore = -1;

//   for (let gen = 0; gen < generations; gen++) {
//     const parents = selectionner(population);
    
//     if (parents.length === 0) {
//       console.warn(`Génération ${gen}: Aucun parent sélectionné`);
//       break;
//     }

//     // Évaluer le meilleur de cette génération
//     const statsGeneration = parents[0].verifierCompletude();
//     const scoreGeneration = statsGeneration.totalSeancesCreees / statsGeneration.totalSeancesAttendues;
    
//     if (scoreGeneration > meilleurScore) {
//       meilleurScore = scoreGeneration;
//       meilleurEdt = parents[0];
//     }

//     console.log(`Génération ${gen + 1}: Meilleur = ${(scoreGeneration * 100).toFixed(1)}% de complétude`);

//     // Si on a un emploi du temps parfait, on peut s'arrêter
//     if (scoreGeneration >= 1.0) {
//       console.log(`🎉 Emploi du temps parfait trouvé à la génération ${gen + 1}!`);
//       break;
//     }

//     const enfants = [];

//     // Garder les meilleurs parents (élitisme)
//     enfants.push(...parents.slice(0, 3));

//     // Générer de nouveaux enfants
//     while (enfants.length < population.length) {
//       const p1 = parents[Math.floor(Math.random() * Math.min(5, parents.length))];
//       const p2 = parents[Math.floor(Math.random() * Math.min(5, parents.length))];
      
//       let enfant = croisement(p1, p2);

//       // Appliquer la mutation avec une probabilité plus élevée si l'EDT est incomplet
//       const statsEnfant = enfant.verifierCompletude();
//       const tauxMutation = statsEnfant.totalSeancesCreees < statsEnfant.totalSeancesAttendues ? 0.5 : 0.2;
      
//       if (Math.random() < tauxMutation) {
//         enfant = mutation(enfant, config);
//       }

//       enfants.push(enfant);
//     }

//     population = enfants;
//   }

//   const resultat = selectionner(population)[0] || meilleurEdt;
  
//   if (resultat) {
//     const statsFinales = resultat.verifierCompletude();
//     console.log(`\n=== Résultat final ===`);
//     console.log(`Séances créées: ${statsFinales.totalSeancesCreees}/${statsFinales.totalSeancesAttendues}`);
//     console.log(`Complétude: ${(statsFinales.totalSeancesCreees / statsFinales.totalSeancesAttendues * 100).toFixed(1)}%`);
    
//     if (statsFinales.matieresManquantes.length > 0) {
//       console.log(`Matières manquantes: ${statsFinales.matieresManquantes.length}`);
//       console.log(statsFinales.matieresManquantes.slice(0, 5).join(', '));
//     }
//   }

//   return resultat;
// };

// module.exports = { 
//   algorithmeGenetique,
//   genererPopulationInitiale,
//   selectionner,
//   croisement,
//   mutation
// };
const { EmploiDuTemps } = require('./edt');
const { evaluerFitness, estValide } = require('./critiries');

// Fonction d'évaluation améliorée qui prend en compte les nouvelles règles
const evaluerFitnessAvecRegles = (edt) => {
  let score = 0;
  let penalites = 0;
  const stats = edt.verifierCompletude();
  
  // 1. Score de base pour la complétude (40% du score total)
  const completudeRatio = stats.totalSeancesCreees / stats.totalSeancesAttendues;
  score += completudeRatio * 400;

  // 2. Bonus pour les matières prioritaires correctement programmées (30% du score)
  let matieresPrioritairesOK = 0;
  let totalMatieresPrioritaires = 0;
  
  for (const classe of edt.classes) {
    for (const matiere of edt.matieres) {
      if (edt.estMatierePrioritaire(matiere.nom)) {
        totalMatieresPrioritaires++;
        const nombreSeances = edt.compterSeancesMatiere(
          classe.id_classe || classe.id,
          matiere.id_matiere || matiere.id
        );
        
        if (nombreSeances >= 2) {
          matieresPrioritairesOK++;
          
          // Bonus supplémentaire si les séances sont réparties sur différents jours
          const seancesMatiere = edt.seance.filter(s => 
            s.classe === (classe.id_classe || classe.id) && 
            s.matiere === (matiere.id_matiere || matiere.id)
          );
          
          const joursUniques = new Set(seancesMatiere.map(s => s.jour));
          if (joursUniques.size === seancesMatiere.length) {
            score += 20; // Bonus pour répartition optimale
          }
        } else if (nombreSeances === 1) {
          score += 10; // Bonus partiel pour au moins une séance
        }
      }
    }
  }
  
  if (totalMatieresPrioritaires > 0) {
    score += (matieresPrioritairesOK / totalMatieresPrioritaires) * 300;
  }

  // 3. Évaluation de la répartition équilibrée des cours dans la semaine (20% du score)
  const repartitionScore = evaluerRepartitionHebdomadaire(edt);
  score += repartitionScore * 200;

  // 4. Pénalités pour les conflits et problèmes (10% du score)
  
  // Pénalité pour les trous dans l'emploi du temps
  penalites += compterTrousEmploiDuTemps(edt) * 10;
  
  // Pénalité pour les matières prioritaires incomplètes
  const matieresPrioritairesIncompletes = totalMatieresPrioritaires - matieresPrioritairesOK;
  penalites += matieresPrioritairesIncompletes * 50;
  
  // Pénalité pour les matières non prioritaires manquantes
  const matieresNormalesManquantes = stats.matieresManquantes.filter(m => 
    !edt.matieres.find(mat => m.includes(mat.nom) && edt.estMatierePrioritaire(mat.nom))
  ).length;
  penalites += matieresNormalesManquantes * 20;

  const scoreFinal = Math.max(0, score - penalites);
  
  return {
    score: scoreFinal,
    completude: completudeRatio,
    matieresPrioritairesOK,
    totalMatieresPrioritaires,
    penalites,
    details: {
      scoreCompletude: completudeRatio * 400,
      scoreMatieresPrioritaires: totalMatieresPrioritaires > 0 ? (matieresPrioritairesOK / totalMatieresPrioritaires) * 300 : 0,
      scoreRepartition: repartitionScore * 200,
      penalitesTotales: penalites
    }
  };
};

// Évaluer la répartition équilibrée des cours dans la semaine
const evaluerRepartitionHebdomadaire = (edt) => {
  const seancesParJour = {};
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  
  jours.forEach(jour => seancesParJour[jour] = 0);
  
  edt.seance.forEach(seance => {
    if (seancesParJour[seance.jour] !== undefined) {
      seancesParJour[seance.jour]++;
    }
  });
  
  const seancesJours = Object.values(seancesParJour);
  const moyenne = seancesJours.reduce((a, b) => a + b, 0) / seancesJours.length;
  const ecartType = Math.sqrt(seancesJours.reduce((acc, val) => acc + Math.pow(val - moyenne, 2), 0) / seancesJours.length);
  
  // Plus l'écart-type est faible, meilleure est la répartition
  return Math.max(0, 1 - (ecartType / moyenne));
};

// Compter les "trous" dans l'emploi du temps (créneaux libres entre deux cours)
const compterTrousEmploiDuTemps = (edt) => {
  let trous = 0;
  
  for (const classe of edt.classes) {
    const seancesClasse = edt.seance
      .filter(s => s.classe === (classe.id_classe || classe.id))
      .sort((a, b) => {
        if (a.jour !== b.jour) {
          const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
          return jours.indexOf(a.jour) - jours.indexOf(b.jour);
        }
        return edt.convertirHeureEnMinutes(a.heureDebut) - edt.convertirHeureEnMinutes(b.heureDebut);
      });
    
    // Compter les trous par jour
    const seancesParJour = {};
    seancesClasse.forEach(seance => {
      if (!seancesParJour[seance.jour]) {
        seancesParJour[seance.jour] = [];
      }
      seancesParJour[seance.jour].push(seance);
    });
    
    Object.values(seancesParJour).forEach(seancesJour => {
      for (let i = 1; i < seancesJour.length; i++) {
        const finPrecedente = edt.convertirHeureEnMinutes(seancesJour[i-1].heureFin);
        const debutSuivante = edt.convertirHeureEnMinutes(seancesJour[i].heureDebut);
        
        // Si il y a plus de 15 minutes d'écart, c'est considéré comme un trou
        if (debutSuivante - finPrecedente > 15) {
          trous++;
        }
      }
    });
  }
  
  return trous;
};

const genererPopulationInitialeAmelioree = (taille, config) => {
  const population = [];
  console.log(`Génération de ${taille} emplois du temps avec nouvelles règles...`);
  
  for (let i = 0; i < taille; i++) {
    const edt = EmploiDuTemps.genererAleatoire(config);
    const evaluation = evaluerFitnessAvecRegles(edt);
    
    console.log(`EDT ${i + 1}: Score ${evaluation.score.toFixed(0)}, ` +
                `Complétude ${(evaluation.completude * 100).toFixed(1)}%, ` +
                `Matières prioritaires ${evaluation.matieresPrioritairesOK}/${evaluation.totalMatieresPrioritaires}`);
    
    // Retourner seulement l'EDT, pas l'objet avec évaluation
    population.push(edt);
  }
  
  return population;
};

const selectionnerAmeliore = (population) => {
  // Évaluer chaque EDT de la population
  const populationAvecEvaluation = population.map(edt => {
    const evaluation = evaluerFitnessAvecRegles(edt);
    return { edt, evaluation };
  });

  return populationAvecEvaluation
    .sort((a, b) => {
      // Vérifier que les évaluations existent
      if (!a.evaluation || !b.evaluation) {
        console.warn('Évaluation manquante détectée');
        return 0;
      }

      // Prioriser d'abord les matières prioritaires, puis le score global
      if (a.evaluation.totalMatieresPrioritaires > 0 && b.evaluation.totalMatieresPrioritaires > 0) {
        const ratioA = a.evaluation.matieresPrioritairesOK / a.evaluation.totalMatieresPrioritaires;
        const ratioB = b.evaluation.matieresPrioritairesOK / b.evaluation.totalMatieresPrioritaires;
        
        if (Math.abs(ratioA - ratioB) > 0.2) {
          return ratioB - ratioA;
        }
      }
      
      return b.evaluation.score - a.evaluation.score;
    })
    .slice(0, Math.min(12, populationAvecEvaluation.length))
    .map(p => p.edt);
};

const croisementAmeliore = (parent1, parent2) => {
  const enfant = new EmploiDuTemps();
  enfant.professeurs = parent1.professeurs;
  enfant.classes = parent1.classes;
  enfant.salles = parent1.salles;
  enfant.matieres = parent1.matieres;
  enfant.creneaux = parent1.creneaux;

  // Stratégie de croisement intelligente basée sur les matières prioritaires
  const seancesParClasseMatiere = {};
  
  // Organiser les séances par classe et matière
  [...parent1.seance, ...parent2.seance].forEach(seance => {
    const cleClasseMatiere = `${seance.classe}_${seance.matiere}`;
    if (!seancesParClasseMatiere[cleClasseMatiere]) {
      seancesParClasseMatiere[cleClasseMatiere] = [];
    }
    seancesParClasseMatiere[cleClasseMatiere].push(seance);
  });

  // Pour chaque combinaison classe-matière
  Object.keys(seancesParClasseMatiere).forEach(cle => {
    const seances = seancesParClasseMatiere[cle];
    const [classeId, matiereId] = cle.split('_');
    
    // Trouver la matière pour déterminer si elle est prioritaire
    const matiere = enfant.matieres.find(m => 
      (m.id_matiere || m.id).toString() === matiereId
    );
    
    if (matiere) {
      const nombreNecessaire = enfant.getNombreSeancesNecessaires(matiere);
      
      // Prendre les meilleures séances disponibles
      const seancesTries = seances
        .filter((seance, index, arr) => 
          arr.findIndex(s => s.jour === seance.jour && s.heureDebut === seance.heureDebut) === index
        )
        .sort(() => Math.random() - 0.5);
      
      // Ajouter les séances nécessaires sans conflit
      let seancesAjoutees = 0;
      for (const seance of seancesTries) {
        if (seancesAjoutees >= nombreNecessaire) break;
        
        if (!enfant.verifierConflits(seance)) {
          enfant.seance.push({
            ...seance,
            id: `croisement_${Date.now()}_${Math.random()}`
          });
          seancesAjoutees++;
        }
      }
    }
  });

  return enfant;
};

const mutationAmelioree = (edt, config) => {
  const evaluation = evaluerFitnessAvecRegles(edt);
  let mutationEffectuee = false;

  // 1. Priorité absolue: compléter les matières prioritaires manquantes
  if (evaluation.matieresPrioritairesOK < evaluation.totalMatieresPrioritaires) {
    mutationEffectuee = ajouterMatierePrioritaireManquante(edt, config);
  }

  // 2. Si les matières prioritaires sont OK, améliorer la répartition
  if (!mutationEffectuee && Math.random() < 0.3) {
    mutationEffectuee = ameliorerRepartitionJours(edt, config);
  }

  // 3. Mutation classique avec probabilité réduite
  if (!mutationEffectuee && Math.random() < 0.1) {
    mutationClassique(edt, config);
  }

  return edt;
};

const ajouterMatierePrioritaireManquante = (edt, config) => {
  for (const classe of edt.classes) {
    for (const matiere of edt.matieres) {
      if (!edt.estMatierePrioritaire(matiere.nom)) continue;
      
      const classeId = classe.id_classe || classe.id;
      const nombreSeances = edt.compterSeancesMatiere(classeId, matiere.id_matiere || matiere.id);
      
      if (nombreSeances < 2) {
        // Essayer d'ajouter une séance manquante
        const prof = edt.professeurs.find(p =>
          p.id === matiere.professeur || p.id_prof === matiere.professeur
        );
        
        if (!prof) continue;
        
        const salle = edt.choisirSalle(matiere);
        if (!salle) continue;
        
        // Filtrer les créneaux pour éviter le même jour si c'est la 2ème séance
        let creneauxDisponibles = edt.creneaux.filter(creneau => {
          const testSeance = {
            classe: classeId,
            professeur: prof.id_prof || prof.id,
            salle: salle.id_salle || salle.id,
            jour: creneau.jour,
            heureDebut: creneau.h_début,
            heureFin: creneau.h_fin
          };
          return !edt.verifierConflits(testSeance);
        });
        
        if (nombreSeances === 1) {
          // Pour la 2ème séance, éviter le même jour que la 1ère
          const seanceExistante = edt.seance.find(s => 
            s.classe === classeId && s.matiere === (matiere.id_matiere || matiere.id)
          );
          
          if (seanceExistante) {
            creneauxDisponibles = creneauxDisponibles.filter(c => c.jour !== seanceExistante.jour);
          }
        }
        
        if (creneauxDisponibles.length > 0) {
          const creneauChoisi = creneauxDisponibles[Math.floor(Math.random() * creneauxDisponibles.length)];
          
          const nouvelleSeance = {
            id: `mutation_prioritaire_${Date.now()}_${Math.random()}`,
            matiere: matiere.id_matiere || matiere.id,
            professeur: prof.id_prof || prof.id,
            salle: salle.id_salle || salle.id,
            classe: classeId,
            jour: creneauChoisi.jour,
            heureDebut: creneauChoisi.h_début,
            heureFin: creneauChoisi.h_fin,
            id_creneau: creneauChoisi.id_créneau
          };
          
          edt.ajouterSeance(nouvelleSeance);
          console.log(`✓ Matière prioritaire ajoutée: ${classe.nom} - ${matiere.nom} (${nombreSeances + 1}/2)`);
          return true;
        }
      }
    }
  }
  return false;
};

const ameliorerRepartitionJours = (edt, config) => {
  // Identifier les matières prioritaires avec 2 séances le même jour
  for (const classe of edt.classes) {
    for (const matiere of edt.matieres) {
      if (!edt.estMatierePrioritaire(matiere.nom)) continue;
      
      const classeId = classe.id_classe || classe.id;
      const seancesMatiere = edt.seance.filter(s => 
        s.classe === classeId && s.matiere === (matiere.id_matiere || matiere.id)
      );
      
      if (seancesMatiere.length === 2) {
        // Vérifier si les deux séances sont le même jour
        if (seancesMatiere[0].jour === seancesMatiere[1].jour) {
          // Essayer de déplacer une des séances vers un autre jour
          const seanceADeplacer = seancesMatiere[Math.floor(Math.random() * 2)];
          const autresJours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
            .filter(jour => jour !== seanceADeplacer.jour);
          
          for (const nouveauJour of autresJours) {
            const creneauxJour = edt.creneaux.filter(c => c.jour === nouveauJour);
            
            for (const creneau of creneauxJour) {
              const nouvelleSeance = {
                ...seanceADeplacer,
                jour: creneau.jour,
                heureDebut: creneau.h_début,
                heureFin: creneau.h_fin,
                id_creneau: creneau.id_créneau
              };
              
              // Supprimer temporairement l'ancienne séance
              const index = edt.seance.indexOf(seanceADeplacer);
              edt.seance.splice(index, 1);
              
              // Tester la nouvelle séance
              if (!edt.verifierConflits(nouvelleSeance)) {
                edt.seance.push(nouvelleSeance);
                console.log(`✓ Séance déplacée pour meilleure répartition: ${classe.nom} - ${matiere.nom}`);
                return true;
              } else {
                // Remettre l'ancienne séance
                edt.seance.splice(index, 0, seanceADeplacer);
              }
            }
          }
        }
      }
    }
  }
  return false;
};

const mutationClassique = (edt, config) => {
  if (edt.seance.length === 0) return;
  
  const index = Math.floor(Math.random() * edt.seance.length);
  const ancienneSeance = edt.seance[index];
  
  const nouveauxCreneaux = edt.creneaux.filter(c => 
    c.jour !== ancienneSeance.jour || c.h_début !== ancienneSeance.heureDebut
  );
  
  if (nouveauxCreneaux.length > 0) {
    const nouveauCreneau = nouveauxCreneaux[Math.floor(Math.random() * nouveauxCreneaux.length)];
    
    const nouvelleSeance = {
      ...ancienneSeance,
      jour: nouveauCreneau.jour,
      heureDebut: nouveauCreneau.h_début,
      heureFin: nouveauCreneau.h_fin,
      id_creneau: nouveauCreneau.id_créneau
    };

    edt.seance.splice(index, 1);
    
    if (!edt.verifierConflits(nouvelleSeance)) {
      edt.seance.push(nouvelleSeance);
    } else {
      edt.seance.splice(index, 0, ancienneSeance);
    }
  }
};

const algorithmeGenetiqueAmeliore = (config, generations = 100) => {
  console.log(`=== Algorithme Génétique Amélioré ===`);
  console.log(`Générations: ${generations}`);
  console.log(`Classes: ${config.classes?.length || 0}`);
  console.log(`Matières: ${config.matieres?.length || 0}`);
  console.log(`Matières prioritaires: ${config.matieres?.filter(m => 
    ['arabe', 'mathématiques', 'français', 'sciences', 'anglais'].some(mp => 
      m.nom.toLowerCase().includes(mp)
    )).length || 0}`);
  console.log(`Créneaux: ${config.creneaux?.length || 0}`);

  let population = genererPopulationInitialeAmelioree(25, config);
  let meilleurEdt = null;
  let meilleurScore = -1;
  let generationsSansAmelioration = 0;

  for (let gen = 0; gen < generations; gen++) {
    const parents = selectionnerAmeliore(population);
    
    if (parents.length === 0) {
      console.warn(`Génération ${gen}: Aucun parent sélectionné`);
      break;
    }

    // Évaluer le meilleur de cette génération
    const evaluationMeilleur = evaluerFitnessAvecRegles(parents[0]);
    
    if (evaluationMeilleur.score > meilleurScore) {
      meilleurScore = evaluationMeilleur.score;
      meilleurEdt = parents[0];
      generationsSansAmelioration = 0;
    } else {
      generationsSansAmelioration++;
    }

    console.log(`Gen ${gen + 1}: Score ${evaluationMeilleur.score.toFixed(0)}, ` +
                `Complétude ${(evaluationMeilleur.completude * 100).toFixed(1)}%, ` +
                `Mat. prior. ${evaluationMeilleur.matieresPrioritairesOK}/${evaluationMeilleur.totalMatieresPrioritaires}, ` +
                `Pénalités ${evaluationMeilleur.penalites}`);

    // Critère d'arrêt: emploi du temps parfait
    if (evaluationMeilleur.completude >= 1.0 && 
        evaluationMeilleur.matieresPrioritairesOK === evaluationMeilleur.totalMatieresPrioritaires) {
      console.log(`🎉 Emploi du temps optimal trouvé à la génération ${gen + 1}!`);
      break;
    }

    // Augmenter la diversité si pas d'amélioration depuis 20 générations
    const tauxMutationAdaptatif = generationsSansAmelioration > 20 ? 0.6 : 0.3;

    const enfants = [];

    // Élitisme: garder les 3 meilleurs
    enfants.push(...parents.slice(0, 3));

    // Générer de nouveaux enfants
    while (enfants.length < population.length) {
      const p1 = parents[Math.floor(Math.random() * Math.min(8, parents.length))];
      const p2 = parents[Math.floor(Math.random() * Math.min(8, parents.length))];
      
      let enfant = croisementAmeliore(p1, p2);

      if (Math.random() < tauxMutationAdaptatif) {
        enfant = mutationAmelioree(enfant, config);
      }

      // Ajouter l'enfant directement (pas d'objet avec évaluation)
      enfants.push(enfant);
    }

    population = enfants;
  }

  const resultat = selectionnerAmeliore(population)[0] || meilleurEdt;
  
  if (resultat) {
    const evaluationFinale = evaluerFitnessAvecRegles(resultat);
    console.log(`\n=== Résultat Final Amélioré ===`);
    console.log(`Score total: ${evaluationFinale.score.toFixed(0)}`);
    console.log(`Complétude: ${(evaluationFinale.completude * 100).toFixed(1)}%`);
    console.log(`Matières prioritaires: ${evaluationFinale.matieresPrioritairesOK}/${evaluationFinale.totalMatieresPrioritaires}`);
    console.log(`Détails des scores:`);
    console.log(`  - Complétude: ${evaluationFinale.details.scoreCompletude.toFixed(0)}`);
    console.log(`  - Matières prioritaires: ${evaluationFinale.details.scoreMatieresPrioritaires.toFixed(0)}`);
    console.log(`  - Répartition: ${evaluationFinale.details.scoreRepartition.toFixed(0)}`);
    console.log(`  - Pénalités: ${evaluationFinale.details.penalitesTotales}`);
    
    // Afficher le résumé des matières prioritaires
    resultat.afficherResumeMatieresPrioritaires();
  }

  return resultat;
};

module.exports = { 
  algorithmeGenetiqueAmeliore,
  evaluerFitnessAvecRegles,
  genererPopulationInitialeAmelioree,
  selectionnerAmeliore,
  croisementAmeliore,
  mutationAmelioree
};