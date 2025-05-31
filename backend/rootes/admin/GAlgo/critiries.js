// Fonction du fitness 
const evaluerFitness = (edt) => {
  // Un score grand est meilleur
  let score = 100;
  
  // Appliquer chaque critère et ajuster le score
  score -= evaluerConflitsHoraires(edt) * 10;  // contr forte pour les conflits
  score -= evaluerChargeJournaliere(edt) * 5;  // contr moyenne pour mauvaise répartition
  score -= evaluerContraintesSpecifiques(edt) * 3;  // contr légère pour contraintes spécifiques

  // min score 0
  return Math.max(0, score);
};

// Évalue les conflits d'horaires entre séances
const evaluerConflitsHoraires = (edt) => {
  let conflits = 0;
  // Pour chaque paire de séances, vérifier s'ils se chevauchent
  for (let i = 0; i < edt.seance.length; i++) {
    for (let j = i + 1; j < edt.seance.length; j++) {
      const seance1 = edt.seance[i];
      const seance2 = edt.seance[j];
      
      // Vérifier s'ils sont le même jour
      if (seance1.jour === seance2.jour) {
        // Vérifier si les horaires se chevauchent
        if (
          (seance1.heureDebut <= seance2.heureDebut && seance2.heureDebut < seance1.heureFin) ||
          (seance2.heureDebut <= seance1.heureDebut && seance1.heureDebut < seance2.heureFin)
        ) {
          // Vérifier s'ils utilisent la même salle ou le même professeur
          if (seance1.salle === seance2.salle || seance1.professeur === seance2.professeur) {
            conflits++;
          }
          
          // Vérifier s'ils concernent le même groupe d'étudiants
          if (seance1.groupe === seance2.groupe) {
            conflits++;
          }
        }
      }
    }
  }
  
  return conflits;
};

// Évalue la répartition de la charge sur la semaine
const evaluerChargeJournaliere = (edt) => {
  // Initialiser un tableau pour compter les heures par jour
  const heuresParJour = {
    'Lundi': 0,
    'Mardi': 0,
    'Mercredi': 0,
    'Jeudi': 0,
    'Vendredi': 0
  };
  
  // Calculer le nombre d'heures par jour
  edt.seance.forEach(seance => {
    const duree = seance.heureFin - seance.heureDebut;
    heuresParJour[seance.jour] += duree;
  });
  
  // Calculer l'écart-type pour évaluer l'équilibre
  const heures = Object.values(heuresParJour);
  const moyenne = heures.reduce((acc, h) => acc + h, 0) / heures.length;
  const ecartType = Math.sqrt(
    heures.reduce((acc, h) => acc + Math.pow(h - moyenne, 2), 0) / heures.length
  );
  
  return ecartType;
};

// Évaluer les contraintes spécifiques (préférences prof, pauses déjeuner, etc.)
const evaluerContraintesSpecifiques = (edt) => {
  let penalites = 0;
  
  // Vérifier les pauses déjeuner (idéalement 12h-14h libre)
  edt.seance.forEach(seance => {
    // Pénalité si une séance empiète sur la pause déjeuner
    if ((seance.heureDebut < 14 && seance.heureFin > 12)) {
      penalites += 10;
    }
  });
  
  // Vérifier les contraintes de disponibilité des professeurs
  edt.seance.forEach(seance => {
    // Trouver le professeur correspondant à cette séance
    const prof = edt.professeurs.find(p => p.id === seance.professeur);
    if (prof && prof.indisponibilites) {
      // Vérifier si la séance est pendant une indisponibilité du professeur
      prof.indisponibilites.forEach(indispo => {
        if (
          indispo.jour === seance.jour &&
          indispo.heureDebut <= seance.heureDebut &&
          indispo.heureFin >= seance.heureFin
        ) {
          penalites += 1;
        }
      });
    }
  });
  
  return penalites;
};

// Vérifier si un emploi du temps est valide (respecte les contraintes dures)
const estValide = (edt) => {
  return evaluerConflitsHoraires(edt) === 0;
};

module.exports = {
  evaluerFitness,
  evaluerConflitsHoraires,
  evaluerChargeJournaliere,
  evaluerContraintesSpecifiques,
  estValide
};