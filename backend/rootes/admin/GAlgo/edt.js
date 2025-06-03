class EmploiDuTemps {
  constructor() {
    this.seance = [];
    this.professeurs = [];
    this.classes = [];
    this.matieres = [];
    this.salles = [];
    this.creneaux = [];
    // Matières prioritaires qui doivent avoir 2 séances par semaine
    this.matieresPrioritaires = ['arabe', 'mathématiques', 'français', 'sciences', 'anglais'];
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
      this.horairesSeRecoupent(seance, nouvelleSeance) &&
      (
        seance.professeur === nouvelleSeance.professeur ||
        seance.salle === nouvelleSeance.salle ||
        seance.classe === nouvelleSeance.classe
      )
    );
  }

  horairesSeRecoupent(seance1, seance2) {
    const debut1 = this.convertirHeureEnMinutes(seance1.heureDebut);
    const fin1 = this.convertirHeureEnMinutes(seance1.heureFin);
    const debut2 = this.convertirHeureEnMinutes(seance2.heureDebut);
    const fin2 = this.convertirHeureEnMinutes(seance2.heureFin);
    
    return debut1 < fin2 && fin1 > debut2;
  }

  convertirHeureEnMinutes(heure) {
    if (typeof heure === 'string') {
      const [h, m] = heure.split(':').map(Number);
      return h * 60 + m;
    }
    return parseFloat(heure) * 60;
  }

  // Compter combien de séances une matière a déjà pour une classe donnée
  compterSeancesMatiere(classeId, matiereId) {
    return this.seance.filter(seance => 
      seance.classe === classeId && seance.matiere === matiereId
    ).length;
  }

  // Vérifier si une matière est prioritaire (doit avoir 2 séances)
  estMatierePrioritaire(nomMatiere) {
    const nom = nomMatiere.toLowerCase();
    return this.matieresPrioritaires.some(mp => nom.includes(mp));
  }

  // Calculer combien de séances sont nécessaires pour une matière
  getNombreSeancesNecessaires(matiere) {
    return this.estMatierePrioritaire(matiere.nom) ? 2 : 1;
  }

  static genererAleatoire(config) {
    const edt = new EmploiDuTemps();
    edt.professeurs = config.professeurs || [];
    edt.salles = config.salles || [];
    edt.classes = config.classes || [];
    edt.matieres = config.matieres || [];
    edt.creneaux = config.creneaux || [];

    if (!edt.matieres.length || !edt.professeurs.length || !edt.classes.length || 
        !edt.salles.length || !edt.creneaux.length) {
      console.warn("Configuration incomplète.");
      return edt;
    }

    console.log(`Génération EDT: ${edt.classes.length} classes, ${edt.matieres.length} matières`);

    let index = 0;
    let tentativesMax = 2000;
    let tentatives = 0;

    // Pour chaque classe
    for (const classe of edt.classes) {
      console.log(`\n=== Traitement de la classe ${classe.nom} ===`);
      
      // Créer une liste de tâches (classe + matière + numéro de séance)
      const tachesACreer = [];
      
      for (const matiere of edt.matieres) {
        const nombreSeances = edt.getNombreSeancesNecessaires(matiere);
        console.log(`  ${matiere.nom}: ${nombreSeances} séance(s) nécessaire(s)`);
        
        for (let i = 0; i < nombreSeances; i++) {
          tachesACreer.push({
            classe: classe,
            matiere: matiere,
            numeroSeance: i + 1
          });
        }
      }

      // Mélanger les tâches pour éviter les patterns
      tachesACreer.sort(() => Math.random() - 0.5);

      // Traiter chaque tâche
      for (const tache of tachesACreer) {
        const { classe, matiere, numeroSeance } = tache;
        
        // Vérifier si on a déjà assez de séances pour cette matière
        const seancesExistantes = edt.compterSeancesMatiere(
          classe.id_classe || classe.id, 
          matiere.id_matiere || matiere.id
        );
        
        if (seancesExistantes >= edt.getNombreSeancesNecessaires(matiere)) {
          continue;
        }

        console.log(`  → Création séance ${numeroSeance} de ${matiere.nom} pour ${classe.nom}`);

        // Trouver le professeur pour cette matière
        const prof = edt.professeurs.find(p =>
          p.id === matiere.professeur || p.id_prof === matiere.professeur
        );

        if (!prof) {
          console.warn(`    ✗ Aucun professeur trouvé pour ${matiere.nom}`);
          continue;
        }

        // Choisir la salle appropriée
        let salle = edt.choisirSalle(matiere);
        if (!salle) {
          console.warn(`    ✗ Aucune salle disponible pour ${matiere.nom}`);
          continue;
        }

        // Essayer de trouver un créneau libre
        let creneauTrouve = false;
        const creneauxMelanges = [...edt.creneaux].sort(() => Math.random() - 0.5);

        // Pour les matières prioritaires, éviter de mettre 2 séances le même jour
        const creneauxFiltres = edt.estMatierePrioritaire(matiere.nom) && numeroSeance > 1 
          ? edt.filtrerCreneauxPourMatierePrioritaire(classe, matiere, creneauxMelanges)
          : creneauxMelanges;

        for (const creneau of creneauxFiltres) {
          if (!creneau.h_début || !creneau.h_fin) {
            continue;
          }

          const tentativeSeance = {
            id: `seance_${index}`,
            matiere: matiere.id_matiere || matiere.id,
            professeur: prof.id_prof || prof.id,
            salle: salle.id_salle || salle.id,
            classe: classe.id_classe || classe.id,
            jour: creneau.jour,
            heureDebut: creneau.h_début,
            heureFin: creneau.h_fin,
            id_creneau: creneau.id_créneau || null
          };

          if (edt.ajouterSeance(tentativeSeance)) {
            console.log(`    ✓ Séance ${numeroSeance} ajoutée: ${matiere.nom} le ${creneau.jour} à ${creneau.h_début}`);
            index++;
            creneauTrouve = true;
            break;
          }
        }

        if (!creneauTrouve) {
          console.warn(`    ✗ Aucun créneau libre trouvé pour ${classe.nom} - ${matiere.nom} (séance ${numeroSeance})`);
          tentatives++;
          
          if (tentatives < tentativesMax) {
            // Essayer de résoudre le conflit
            if (edt.resoudreConflit(classe, matiere, prof, salle)) {
              console.log(`    ✓ Conflit résolu pour ${matiere.nom} séance ${numeroSeance}`);
              // Réessayer avec un créneau aléatoire
              const nouveauCreneau = edt.creneaux[Math.floor(Math.random() * edt.creneaux.length)];
              if (nouveauCreneau && nouveauCreneau.h_début && nouveauCreneau.h_fin) {
                const nouvelleSeance = {
                  id: `seance_${index++}`,
                  matiere: matiere.id_matiere || matiere.id,
                  professeur: prof.id_prof || prof.id,
                  salle: salle.id_salle || salle.id,
                  classe: classe.id_classe || classe.id,
                  jour: nouveauCreneau.jour,
                  heureDebut: nouveauCreneau.h_début,
                  heureFin: nouveauCreneau.h_fin,
                  id_creneau: nouveauCreneau.id_créneau || null
                };
                edt.ajouterSeance(nouvelleSeance);
              }
            }
          }
        }
      }
    }

    console.log(`\n=== Résumé de génération ===`);
    console.log(`Total séances créées: ${edt.seance.length}`);
    
    const seancesAttendues = edt.classes.length * edt.matieres.reduce((total, matiere) => {
      return total + edt.getNombreSeancesNecessaires(matiere);
    }, 0);
    
    console.log(`Séances attendues: ${seancesAttendues}`);
    console.log(`Taux de réussite: ${((edt.seance.length / seancesAttendues) * 100).toFixed(1)}%`);
    
    return edt;
  }

  // Filtrer les créneaux pour éviter 2 séances de la même matière le même jour
  filtrerCreneauxPourMatierePrioritaire(classe, matiere, creneaux) {
    const seancesExistantes = this.seance.filter(s => 
      s.classe === (classe.id_classe || classe.id) && 
      s.matiere === (matiere.id_matiere || matiere.id)
    );

    if (seancesExistantes.length === 0) {
      return creneaux; // Première séance, pas de restriction
    }

    // Récupérer les jours où cette matière a déjà des séances pour cette classe
    const joursOccupes = seancesExistantes.map(s => s.jour);
    
    // Filtrer pour éviter les jours déjà occupés
    const creneauxLibres = creneaux.filter(c => !joursOccupes.includes(c.jour));
    
    // Si aucun créneau libre dans d'autres jours, utiliser tous les créneaux
    return creneauxLibres.length > 0 ? creneauxLibres : creneaux;
  }

  choisirSalle(matiere) {
    const nomMatiere = (matiere.nom || '').toLowerCase();
    
    if (nomMatiere.includes('informatique')) {
      return this.salles.find(s => (s.nom || '').toLowerCase().includes('informatique'));
    } else if (nomMatiere.includes('sport')) {
      return this.salles.find(s => (s.nom || '').toLowerCase().includes('sport'));
    } else {
      // Exclure la bibliothèque et les salles spécialisées
      const sallesDisponibles = this.salles.filter(s => {
        const nomSalle = (s.nom || '').toLowerCase();
        return !nomSalle.includes('bibliothèque') && 
               !nomSalle.includes('informatique') && 
               !nomSalle.includes('sport');
      });
      
      if (sallesDisponibles.length === 0) {
        // Si aucune salle généraliste, utiliser n'importe quelle salle sauf bibliothèque
        const autresSalles = this.salles.filter(s => 
          !(s.nom || '').toLowerCase().includes('bibliothèque')
        );
        return autresSalles[Math.floor(Math.random() * autresSalles.length)];
      }
      
      return sallesDisponibles[Math.floor(Math.random() * sallesDisponibles.length)];
    }
  }

  resoudreConflit(classe, matiere, prof, salle) {
    // Stratégie simple: essayer de déplacer une séance existante
    const seancesModifiables = this.seance.filter(s => 
      s.classe !== (classe.id_classe || classe.id)
    );

    if (seancesModifiables.length > 0) {
      // Supprimer temporairement une séance pour faire de la place
      const seanceADeplacer = seancesModifiables[0];
      const index = this.seance.indexOf(seanceADeplacer);
      this.seance.splice(index, 1);
      return true;
    }
    
    return false;
  }

  formaterPourAffichage() {
    const planning = {};
    const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];

    jours.forEach(jour => {
      planning[jour] = {};
    });

    this.seance.forEach(seance => {
      const heure = seance.heureDebut.toString().substring(0, 5);
      if (!planning[seance.jour]) {
        planning[seance.jour] = {};
      }
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

  // Méthode pour vérifier la complétude de l'emploi du temps avec nouvelles règles
  verifierCompletude() {
    const statistiques = {
      seancesParClasse: {},
      matieresManquantes: [],
      totalSeancesAttendues: 0,
      totalSeancesCreees: this.seance.length,
      detailsMatieresParClasse: {}
    };

    // Calculer le nombre total de séances attendues
    statistiques.totalSeancesAttendues = this.classes.length * this.matieres.reduce((total, matiere) => {
      return total + this.getNombreSeancesNecessaires(matiere);
    }, 0);

    // Analyser chaque classe
    for (const classe of this.classes) {
      const classeId = classe.id_classe || classe.id;
      const seancesClasse = this.seance.filter(s => s.classe === classeId);
      
      statistiques.seancesParClasse[classe.nom] = {
        total: seancesClasse.length,
        attendu: this.matieres.reduce((total, matiere) => total + this.getNombreSeancesNecessaires(matiere), 0),
        matieres: {},
        manquantes: []
      };

      statistiques.detailsMatieresParClasse[classe.nom] = {};

      // Analyser chaque matière pour cette classe
      for (const matiere of this.matieres) {
        const matiereId = matiere.id_matiere || matiere.id;
        const seancesMatiere = seancesClasse.filter(s => s.matiere === matiereId);
        const nombreAttendu = this.getNombreSeancesNecessaires(matiere);
        const nombreActuel = seancesMatiere.length;

        statistiques.detailsMatieresParClasse[classe.nom][matiere.nom] = {
          actuel: nombreActuel,
          attendu: nombreAttendu,
          complet: nombreActuel >= nombreAttendu
        };

        statistiques.seancesParClasse[classe.nom].matieres[matiere.nom] = nombreActuel;

        // Vérifier les matières manquantes ou incomplètes
        if (nombreActuel < nombreAttendu) {
          const manquant = nombreAttendu - nombreActuel;
          statistiques.seancesParClasse[classe.nom].manquantes.push(
            `${matiere.nom} (${manquant}/${nombreAttendu})`
          );
          statistiques.matieresManquantes.push(
            `${classe.nom} - ${matiere.nom} (${manquant} séances manquantes)`
          );
        }
      }
    }

    return statistiques;
  }

  // Afficher un résumé des séances par matière prioritaire
  afficherResumeMatieresPrioritaires() {
    console.log('\n=== Résumé des matières prioritaires (2 séances/semaine) ===');
    
    for (const classe of this.classes) {
      console.log(`\nClasse ${classe.nom}:`);
      
      for (const matiere of this.matieres) {
        if (this.estMatierePrioritaire(matiere.nom)) {
          const nombreSeances = this.compterSeancesMatiere(
            classe.id_classe || classe.id,
            matiere.id_matiere || matiere.id
          );
          
          const status = nombreSeances >= 2 ? '✓' : '✗';
          console.log(`  ${status} ${matiere.nom}: ${nombreSeances}/2 séances`);
        }
      }
    }
  }
}

module.exports = {
  EmploiDuTemps
};