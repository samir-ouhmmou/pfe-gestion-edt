// Structure d'un emploi du temps
class EmploiDuTemps {
  constructor() {
    this.seance = [];
    this.professeurs = [];
    this.groupe = [];
    this.salles = [];
    this.matieres = [];
  }
  
  // Ajouter une séance à l'emploi du temps
  ajouterSeance(seance) {
    this.seance.push(seance);
  }
  
  // Supprimer une séance de l'emploi du temps
  supprimerSeance(idSeance) {
    this.seance = this.seance.filter(c => c.id !== idSeance);
  }
  
  // Ajouter un professeur
  ajouterProfesseur(professeur) {
    this.professeurs.push(professeur);
  }
  
  // Ajouter un groupe d'étudiants
  ajouterGroupe(groupe) {
    this.groupe.push(groupe);
  }
  
  // Ajouter une salle
  ajouterSalle(salle) {
    this.salles.push(salle);
  }
  
  // Ajouter une matière
  ajouterMatiere(matiere) {
    this.matieres.push(matiere);
  }
  
  // Obtenir les séances d'un professeur
  getSeanceParProfesseur(idProfesseur) {
    return this.seance.filter(c => c.professeur === idProfesseur);
  }
  
  // Obtenir les séances d'un groupe
  getSeanceParGroupe(idGroupe) {
    return this.seance.filter(c => c.groupe === idGroupe);
  }
  
  // Obtenir les séances dans une salle
  getSeanceParSalle(idSalle) {
    return this.seance.filter(c => c.salle === idSalle);
  }
  
  // Créer un emploi du temps aléatoire (pour initialisation de l'algorithme génétique)
  static genererAleatoire(config) {
    const edt = new EmploiDuTemps();
    
    // Copier les configurations
    edt.professeurs = config.professeurs || [];
    edt.salles = config.salles || [];
    edt.groupe = config.groupe || [];
    edt.matieres = config.matieres || [];
    
    // Générer les séances
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const heuresDebut = [8, 9, 10, 11, 13, 14, 15, 16];
    
    // Pour chaque matière, créer une séance
    if (!Array.isArray(config.matieres) || config.matieres.length === 0) {
      console.warn("Aucune matière dans la configuration. Emploi du temps vide.");
      return edt;
    }
    
    config.matieres.forEach((matiere, index) => {
      // Vérifier si les tableaux nécessaires existent et ne sont pas vides
      if (!config.professeurs || config.professeurs.length === 0 ||
          !config.salles || config.salles.length === 0 ||
          !config.groupe || config.groupe.length === 0) {
        console.warn("Configuration incomplète. Certains tableaux sont vides.");
        return;
      }
      
      // Choisir un jour, heure, prof, salle et groupe aléatoirement
      const jour = jours[Math.floor(Math.random() * jours.length)];
      const heureDebut = heuresDebut[Math.floor(Math.random() * heuresDebut.length)];
      const duree = matiere.duree || 2; // Par défaut 2h
      
      // Sélection aléatoire en utilisant les bonnes clés
      const professeur = config.professeurs[Math.floor(Math.random() * config.professeurs.length)];
      const salle = config.salles[Math.floor(Math.random() * config.salles.length)];
      const groupe = config.groupe[Math.floor(Math.random() * config.groupe.length)];
      
      // Extraire les IDs selon la structure disponible
      const idProf = professeur.id_prof || professeur.id;
      const idSalle = salle.id_salle || salle.id;
      const idGroupe = groupe.id_classe || groupe.id;
      
      // Créer la séance
      edt.ajouterSeance({
        id: `seance_${index}`,
        matiere: matiere.id_matiere || matiere.id,
        professeur: idProf,
        salle: idSalle,
        groupe: idGroupe,
        jour: jour,
        heureDebut: heureDebut,
        heureFin: heureDebut + duree
      });
    });
    
    return edt;
  }
  
  // Convertir l'emploi du temps en format lisible pour affichage
  formaterPourAffichage() {
    // Créer une structure par jour et par heure
    const planning = {};
    
    // Initialiser les jours
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    jours.forEach(jour => {
      planning[jour] = {};
      
      // Initialiser les heures (8h-18h)
      for (let heure = 8; heure <= 18; heure++) {
        planning[jour][heure] = [];
      }
    });
    
    // Remplir avec les séances
    this.seance.forEach(seance => {
      // Pour chaque heure de la séance
      for (let h = seance.heureDebut; h < seance.heureFin; h++) {
        if (planning[seance.jour] && planning[seance.jour][h]) {
          // Trouver les noms des objets référencés
          const matiere = this.matieres.find(m => (m.id_matiere || m.id) === seance.matiere);
          const professeur = this.professeurs.find(p => (p.id_prof || p.id) === seance.professeur);
          const salle = this.salles.find(s => (s.id_salle || s.id) === seance.salle);
          const groupe = this.groupe.find(g => (g.id_classe || g.id) === seance.groupe);
          
          planning[seance.jour][h].push({
            id: seance.id,
            matiere: matiere ? (matiere.nom || "Inconnu") : 'Inconnu',
            professeur: professeur ? (professeur.nom || "Inconnu") : 'Inconnu',
            salle: salle ? (salle.nom || "Inconnue") : 'Inconnue',
            groupe: groupe ? (groupe.nom || "Inconnu") : 'Inconnu'
          });
        }
      }
    });
    
    return planning;
  }
  
  // Vérifier si l'emploi du temps est valide
  estValide() {
    // Vérifier les conflits de salle et de professeur
    for (let i = 0; i < this.seance.length; i++) {
      for (let j = i + 1; j < this.seance.length; j++) {
        const seance1 = this.seance[i];
        const seance2 = this.seance[j];
        
        // Vérifier s'ils sont le même jour
        if (seance1.jour === seance2.jour) {
          // Vérifier si les horaires se chevauchent
          const chevauchement = (
            (seance1.heureDebut <= seance2.heureDebut && seance2.heureDebut < seance1.heureFin) ||
            (seance2.heureDebut <= seance1.heureDebut && seance1.heureDebut < seance2.heureFin)
          );
          
          if (chevauchement) {
            // Vérifier les conflits de salle
            if (seance1.salle === seance2.salle) {
              return false; // Conflit de salle
            }
            
            // Vérifier les conflits de professeur
            if (seance1.professeur === seance2.professeur) {
              return false; // Conflit de professeur
            }
            
            // Vérifier les conflits de groupe
            if (seance1.groupe === seance2.groupe) {
              return false; // Conflit de groupe
            }
          }
        }
      }
    }
    
    return true;
  }
}

// Configuration d'exemple pour tester
const configurationExemple = {
  professeurs: [
    { id: 'prof1', nom: 'Dr. Martin', indisponibilites: [{ jour: 'Vendredi', heureDebut: 14, heureFin: 18 }] },
    { id: 'prof2', nom: 'Dr. Dupont', indisponibilites: [{ jour: 'Lundi', heureDebut: 8, heureFin: 12 }] },
    { id: 'prof3', nom: 'Dr. Bernard', indisponibilites: [] }
  ],
  salles: [
    { id: 'salle1', nom: 'A101', capacite: 30 },
    { id: 'salle2', nom: 'B205', capacite: 20 },
    { id: 'salle3', nom: 'C310', capacite: 50 }
  ],
  groupe: [
    { id: 'groupe1', nom: 'L1 Informatique', effectif: 25 },
    { id: 'groupe2', nom: 'L2 Informatique', effectif: 20 },
    { id: 'groupe3', nom: 'L3 Informatique', effectif: 15 }
  ],
  matieres: [
    { id: 'mat1', nom: 'Algorithmique', duree: 2 },
    { id: 'mat2', nom: 'Programmation Java', duree: 3 },
    { id: 'mat3', nom: 'Base de données', duree: 2 },
    { id: 'mat4', nom: 'Réseaux', duree: 2 },
    { id: 'mat5', nom: 'Mathématiques', duree: 2 }
  ]
};

module.exports = {
  EmploiDuTemps,
  configurationExemple
};