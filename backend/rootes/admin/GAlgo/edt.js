// class EmploiDuTemps {
//   constructor() {
//     this.seance = [];
//     this.professeurs = [];
//     this.classes = [];
//     this.salles = [];
//     this.matieres = [];
//     this.creneaux = [];
//   }

//   ajouterSeance(seance) {
//     this.seance.push(seance);
//   }

//   static genererAleatoire(config) {
//     const edt = new EmploiDuTemps();

//     edt.professeurs = config.professeurs || [];
//     edt.salles = config.salles || [];
//     edt.classes = config.classes || [];
//     edt.matieres = config.matieres || [];
//     edt.creneaux = config.creneaux || [];

//     if (!edt.matieres.length || !edt.professeurs.length || !edt.classes.length || !edt.salles.length || !edt.creneaux.length) {
//       console.warn("Configuration incomplète : données manquantes.");
//       return edt;
//     }

//     const nbSeances = config.matieres.length * edt.classes.length;

//     let index = 0;
//     for (let i = 0; i < nbSeances; i++) {
//       const matiere = edt.matieres[Math.floor(Math.random() * edt.matieres.length)];
//       const professeur = edt.professeurs[Math.floor(Math.random() * edt.professeurs.length)];
//       const salle = edt.salles[Math.floor(Math.random() * edt.salles.length)];
//       const classe = edt.classes[Math.floor(Math.random() * edt.classes.length)];
//       const creneau = edt.creneaux[Math.floor(Math.random() * edt.creneaux.length)];

//       if (!matiere || !professeur || !salle || !classe || !creneau) {
//         console.warn("Séance invalide ignorée : ", { matiere, professeur, salle, classe, creneau });
//         continue;
//       }

//       edt.ajouterSeance({
//         id: `seance_${index++}`,
//         matiere: matiere.id_matiere || matiere.id,
//         professeur: professeur.id_prof || professeur.id,
//         salle: salle.id_salle || salle.id,
//         classe: classe.id_classe || classe.id,
//         jour: creneau.jour,
//         heureDebut: creneau.h_début,
//         heureFin: creneau.h_fin,
//         id_creneau: creneau.id_créneau
//       });
//     }

//     return edt;
//   }

//   formaterPourAffichage() {
//     const planning = {};
//     const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

//     jours.forEach(jour => {
//       planning[jour] = {};
//     });

//     this.seance.forEach(seance => {
//       const heure = seance.heureDebut.toString().substring(0, 5);
//       if (!planning[seance.jour][heure]) {
//         planning[seance.jour][heure] = [];
//       }

//       planning[seance.jour][heure].push({
//         id: seance.id,
//         matiere: seance.matiere,
//         professeur: seance.professeur,
//         salle: seance.salle,
//         classe: seance.classe
//       });
//     });

//     return planning;
//   }
// }

// const configurationExemple = {
//   professeurs: [],
//   salles: [],
//   classes: [],
//   matieres: [],
//   creneaux: []
// };

// module.exports = {
//   EmploiDuTemps,
//   configurationExemple
// };
// class EmploiDuTemps {
//   constructor() {
//     this.seance = [];
//     this.professeurs = [];
//     this.classes = [];
//     this.salles = [];
//     this.matieres = [];
//     this.creneaux = [];
//   }

//   ajouterSeance(seance) {
//     this.seance.push(seance);
//   }

//   static genererAleatoire(config) {
//     const edt = new EmploiDuTemps();

//     edt.professeurs = config.professeurs || [];
//     edt.salles = config.salles || [];
//     edt.classes = config.classes || [];
//     edt.matieres = config.matieres || [];
//     edt.creneaux = config.creneaux || [];

//     if (!edt.matieres.length || !edt.professeurs.length || !edt.classes.length || !edt.salles.length || !edt.creneaux.length) {
//       console.warn("Configuration incomplète.");
//       return edt;
//     }

//     let index = 0;

//     for (const classe of edt.classes) {
//       for (const matiere of edt.matieres) {
//         // Trouver un prof qui enseigne cette matière
//         const prof = edt.professeurs.find(p => {
//           return p.id === matiere.professeur || p.id_prof === matiere.professeur;
//         });

//         if (!prof) continue;

//         // Salle en fonction du type de matière
//         let salle = null;
//         if (matiere.nom.toLowerCase() === 'informatique') {
//           salle = edt.salles.find(s => s.nom.toLowerCase() === 'informatique');
//         } else if (matiere.nom.toLowerCase() === 'sport') {
//           salle = edt.salles.find(s => s.nom.toLowerCase() === 'sport');
//         } else {
//           const sallesDisponibles = edt.salles.filter(s => s.nom.toLowerCase() !== 'bibliothèque');
//           salle = sallesDisponibles[Math.floor(Math.random() * sallesDisponibles.length)];
//         }

//         if (!salle) continue;

//         // Choisir un créneau aléatoire (sans vérifier les conflits ici)
//         const creneau = edt.creneaux[Math.floor(Math.random() * edt.creneaux.length)];
//           if (!creneau || !creneau.h_début || !creneau.h_fin) {
//             console.warn(`Créneau invalide ignoré pour ${classe.nom}, ${matiere.nom}`);
//             continue;
//           }


//         edt.ajouterSeance({
//           id: `seance_${index++}`,
//           matiere: matiere.id_matiere || matiere.id,
//           professeur: prof.id_prof || prof.id,
//           salle: salle.id_salle || salle.id,
//           classe: classe.id_classe || classe.id,
//           jour: creneau.jour,
//           heureDebut: creneau.h_début,  // ✅ garder au format texte
//           heureFin: creneau.h_fin,      // ✅ garder au format texte
//           id_creneau: creneau.id_créneau
//         });
//       }
//     }

//     return edt;
//   }

//   formaterPourAffichage() {
//     const planning = {};
//     const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

//     jours.forEach(jour => {
//       planning[jour] = {};
//     });

//     this.seance.forEach(seance => {
//       const heure = seance.heureDebut.toString().substring(0, 5);
//       if (!planning[seance.jour][heure]) {
//         planning[seance.jour][heure] = [];
//       }

//       planning[seance.jour][heure].push({
//         id: seance.id,
//         matiere: seance.matiere,
//         professeur: seance.professeur,
//         salle: seance.salle,
//         classe: seance.classe
//       });
//     });

//     return planning;
//   }
// }

// const configurationExemple = {
//   professeurs: [],
//   salles: [],
//   classes: [],
//   matieres: [],
//   creneaux: []
// };

// module.exports = {
//   EmploiDuTemps,
//   configurationExemple
// };
class EmploiDuTemps {
  constructor() {
    this.seance = [];
    this.professeurs = [];
    this.classes = [];
    this.matieres = [];
    this.salles = [];
    this.creneaux = [];
  }

  ajouterSeance(seance) {
    if (!this.verifierConflits(seance)) {
      this.seance.push(seance);
      return true;
    }
    return false;
  }

  verifierConflits(nouvelleSeance) {
    return this.seance.some(seance =>
      seance.jour === nouvelleSeance.jour &&
      (
        (seance.heureDebut < nouvelleSeance.heureFin && seance.heureFin > nouvelleSeance.heureDebut) &&
        (
          seance.professeur === nouvelleSeance.professeur ||
          seance.salle === nouvelleSeance.salle ||
          seance.classe === nouvelleSeance.classe
        )
      )
    );
  }

  static genererAleatoire(config) {
    const edt = new EmploiDuTemps();
    edt.professeurs = config.professeurs || [];
    edt.salles = config.salles || [];
    edt.classes = config.classes || [];
    edt.matieres = config.matieres || [];
    edt.creneaux = config.creneaux || [];
    edt.classes = [...edt.classes].sort(() => Math.random() - 0.5);

    if (!edt.matieres.length || !edt.professeurs.length || !edt.classes.length || !edt.salles.length || !edt.creneaux.length) {
      console.warn("Configuration incomplète.");
      return edt;
    }

    const heuresParProf = {};
    let index = 0;

    for (const classe of edt.classes) {
      for (const matiere of edt.matieres) {
        const prof = edt.professeurs.find(p => p.id === matiere.professeur || p.id_prof === matiere.professeur);
        if (!prof) continue;

        let salle = null;
        const nomMatiere = matiere.nom.toLowerCase();

        if (nomMatiere === 'informatique') {
          salle = edt.salles.find(s => s.nom.toLowerCase() === 'informatique');
        } else if (nomMatiere === 'sport') {
          salle = edt.salles.find(s => s.nom.toLowerCase() === 'sport');
        } else {
          const autres = edt.salles.filter(s => s.nom.toLowerCase() !== 'bibliothèque');
          salle = autres[Math.floor(Math.random() * autres.length)];
        }

        if (!salle) continue;

        const creneauxMelanges = [...edt.creneaux].sort(() => 0.5 - Math.random());
        let creneauLibre = null;

        for (const creneau of creneauxMelanges) {
          const tentative = {
            classe: classe.id_classe || classe.id,
            professeur: prof.id_prof || prof.id,
            salle: salle.id_salle || salle.id,
            jour: creneau.jour,
            heureDebut: creneau.h_début,
            heureFin: creneau.h_fin,
          };

          // if (!edt.verifierConflits(tentative)) {
          //   creneauLibre = creneau;
          //   break;
          // } 
          if (!edt.seanceAjoutee) {
            creneauLibre = creneau;
      console.warn(`Aucune séance possible pour ${classe.nom} en ${matiere.nom}`);
            break;
    }
        }

        if (!creneauLibre) {
          console.warn(`Créneau introuvable pour ${classe.nom} ${matiere.nom}`);
          continue;
        }

        edt.ajouterSeance({
          id: `seance_${index++}`,
          matiere: matiere.id_matiere || matiere.id,
          professeur: prof.id_prof || prof.id,
          salle: salle.id_salle || salle.id,
          classe: classe.id_classe || classe.id,
          jour: creneauLibre.jour,
          heureDebut:creneauLibre.h_début,
          heureFin: creneauLibre.h_fin,
          id_creneau: creneauLibre.id_créneau
        });
      }
    }

    return edt;
  }

  formaterPourAffichage() {
    const planning = {};
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    jours.forEach(jour => {
      planning[jour] = {};
    });

    this.seance.forEach(seance => {
      const heure = seance.heureDebut.toString().substring(0, 5);
      if (!planning[seance.jour][heure]) {
        planning[seance.jour][heure] = [];
      }

      planning[seance.jour][heure].push({
        id: seance.id,
        matiere: seance.matiere,
        professeur: seance.professeur,
        salle: seance.salle,
        classe: seance.classe
      });
    });

    return planning;
  }
}

module.exports = {
  EmploiDuTemps
};

