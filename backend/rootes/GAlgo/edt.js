

// Structure d'un emploi du temps
class EmploiDuTemps {
    constructor() {
      this.seance = [];
      this.professeurs = [];
      this.classes = [];
      this.salles = [];
      this.matieres = [];
    }
    
    // Ajouter un seance à l'emploi du temps
    ajouterseance(seance) {
      this.seance.push(seance);
    }
    
    // Supprimer un seance de l'emploi du temps
    supprimerseance(idseance) {
      this.seance = this.seance.filter(c => c.id !== idseance);
    }
    
    // Ajouter un professeur
    ajouterProfesseur(professeur) {
      this.professeurs.push(professeur);
    }
    
    // Ajouter un groupe d'étudiants
    ajouterGroupe(groupe) {
      this.classes.push(groupe);
    }
    
    // Ajouter une salle
    ajouterSalle(salle) {
      this.salles.push(salle);
    }
    
    // Ajouter une matière
    ajouterMatiere(matiere) {
      this.matieres.push(matiere);
    }
    
    // Obtenir les seance d'un professeur
    getseanceParProfesseur(idProfesseur) {
      return this.seance.filter(c => c.professeur === idProfesseur);
    }
    
    // Obtenir les seance d'un groupe
    getseanceParGroupe(idGroupe) {
      return this.seance.filter(c => c.groupe === idGroupe);
    }
    
    // Obtenir les seance dans une salle
    getseanceParSalle(idSalle) {
      return this.seance.filter(c => c.salle === idSalle);
    }
    
    // Créer un emploi du temps aléatoire (pour initialisation de l'algorithme génétique)
    static genererAleatoire(config) {
      const edt = new EmploiDuTemps();
      
      // Copier les configurations
      edt.professeurs = config.professeurs || [];
      edt.salles = config.salles || [];
      edt.classes = config.classes || [];
      edt.matieres = config.matieres || [];
      
      // Générer les seance
      const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
      const heuresDebut = [8, 9, 10, 11, 13, 14, 15, 16, 17];
      
      // Pour chaque matière, créer un seance
      config.matieres.forEach((matiere, index) => {
        // Choisir un jour, heure, prof, salle et groupe aléatoirement
        const jour = jours[Math.floor(Math.random() * jours.length)];
        const heureDebut = heuresDebut[Math.floor(Math.random() * heuresDebut.length)];
        const duree = matiere.duree || 2; // Par défaut 2h
        const idProf = config.professeurs[Math.floor(Math.random() * config.professeurs.length)].id;
        const idSalle = config.salles[Math.floor(Math.random() * config.salles.length)].id;
        const idGroupe = config.classes[Math.floor(Math.random() * config.classes.length)].id;
        
        // Créer le seance
        edt.ajouterseance({
          id: `seance_${index}`,
          matiere: matiere.id,
          professeur: idProf,
          salle: idSalle,
          groupe: idGroupe,
          jour: jour,
          heureDebut: heureDebut,
          heureFin: heureDebut + duree
        });
      });
      //juste pour vérifier 
      if (!Array.isArray(config.matieres) || config.matieres.length === 0) {
        console.warn("Aucune matière dans la configuration. Emploi du temps vide.");
        return edt;
      }
      
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
      
      // Remplir avec les seance
      this.seance.forEach(seance => {
        // Pour chaque heure du seance
        for (let h = seance.heureDebut; h < seance.heureFin; h++) {
          if (planning[seance.jour] && planning[seance.jour][h]) {
            // Trouver les noms des objets référencés
            const matiere = this.matieres.find(m => m.id === seance.matiere);
            const professeur = this.professeurs.find(p => p.id === seance.professeur);
            const salle = this.salles.find(s => s.id === seance.salle);
            const groupe = this.classes.find(g => g.id === seance.groupe);
            
            planning[seance.jour][h].push({
              id: seance.id,
              matiere: matiere ? matiere.nom : 'Inconnu',
              professeur: professeur ? professeur.nom : 'Inconnu',
              salle: salle ? salle.nom : 'Inconnue',
              groupe: groupe ? groupe.nom : 'Inconnu'
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
    classes: [
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