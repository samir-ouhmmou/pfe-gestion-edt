class EmploiDuTemps {
  constructor() {
    this.seance = [];
    this.professeurs = [];
    this.classes = [];
    this.salles = [];
    this.matieres = [];
    this.creneaux = [];
  }

  ajouterSeance(seance) {
    this.seance.push(seance);
  }

  static genererAleatoire(config) {
    const edt = new EmploiDuTemps();

    edt.professeurs = config.professeurs || [];
    edt.salles = config.salles || [];
    edt.classes = config.classes || [];
    edt.matieres = config.matieres || [];
    edt.creneaux = config.creneaux || [];

    if (
      !edt.matieres.length ||
      !edt.professeurs.length ||
      !edt.classes.length ||
      !edt.salles.length ||
      !edt.creneaux.length
    ) {
      console.warn("Configuration incomplète : données manquantes.");
      return edt;
    }

    let index = 0;

    for (const classe of edt.classes) {
      for (const matiere of edt.matieres) {
        // Associer un professeur à la matière
        const prof = edt.professeurs.find(p =>
          p.id === matiere.professeur || p.id_prof === matiere.professeur
        );

        if (!prof) continue;

        // Choisir une salle adaptée
        let salle = null;
        const nomMatiere = matiere.nom?.toLowerCase() || "";

        if (nomMatiere === 'informatique') {
          salle = edt.salles.find(s => s.nom?.toLowerCase() === 'informatique');
        } else if (nomMatiere === 'sport') {
          salle = edt.salles.find(s => s.nom?.toLowerCase() === 'sport');
        } else {
          const sallesDisponibles = edt.salles.filter(s => s.nom?.toLowerCase() !== 'bibliothèque');
          salle = sallesDisponibles[Math.floor(Math.random() * sallesDisponibles.length)];
        }

        if (!salle) continue;

        // Choisir un créneau aléatoire (sans gestion des conflits)
        const creneau = edt.creneaux[Math.floor(Math.random() * edt.creneaux.length)];

        if (!creneau || !creneau.h_début || !creneau.h_fin) {
          console.warn(`Créneau invalide ignoré pour ${classe.nom}, ${matiere.nom}`);
          continue;
        }

        edt.ajouterSeance({
          id: `seance_${index++}`,
          matiere: matiere.id_matiere || matiere.id,
          professeur: prof.id_prof || prof.id,
          salle: salle.id_salle || salle.id,
          classe: classe.id_classe || classe.id,
          jour: creneau.jour,
          heureDebut: creneau.h_début,
          heureFin: creneau.h_fin,
          id_creneau: creneau.id_créneau
        });
      }
    }

    return edt;
  }

  formaterPourAffichage() {
    const planning = {};
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    for (const jour of jours) {
      planning[jour] = {};
    }

    for (const seance of this.seance) {
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
    }

    return planning;
  }
}

const configurationExemple = {
  professeurs: [],
  salles: [],
  classes: [],
  matieres: [],
  creneaux: []
};

module.exports = {
  EmploiDuTemps,
  configurationExemple
};
