
const critiries = require('./critiries');
const edt = require('./edt');

class AlgorithmeGenetique {
  constructor(parametres = {}) {
    // Paramètres par défaut
    this.taillePopulation = parametres.taillePopulation || 100;
    this.tauxMutation = parametres.tauxMutation || 0.1;
    this.tauxCroisement = parametres.tauxCroisement || 0.7;
    this.nombreGenerations = parametres.nombreGenerations || 100;
    this.elitisme = parametres.elitisme !== undefined ? parametres.elitisme : true;
    this.nombreElites = parametres.nombreElites || 2;
    
    // État interne
    this.population = [];
    this.meilleuresSolutions = [];
    this.generation = 0;
  }
  
  // Initialiser une population aléatoire
  initialiserPopulation(generateur) {
    this.population = [];
    for (let i = 0; i < this.taillePopulation; i++) {
      const individu = generateur();
      this.population.push({
        edt: individu,
        fitness: critiries.evaluerFitness(individu)
      });
    }
    this.trierPopulation();
  }
  
  // Exécuter l'algorithme génétique
  executer(generateur, nombreGenerations = this.nombreGenerations) {
    // Initialiser la population si ce n'est pas déjà fait
    if (this.population.length === 0) {
      this.initialiserPopulation(generateur);
    }
    
    for (let g = 0; g < nombreGenerations; g++) {
      this.generation++;
      
      // Créer une nouvelle génération
      const nouvellePopulation = [];
      
      // Élitisme: conserver les meilleurs individus
      if (this.elitisme) {
        for (let i = 0; i < this.nombreElites; i++) {
          nouvellePopulation.push(this.population[i]);
        }
      }
      
      // Créer de nouveaux individus jusqu'à remplir la population
      while (nouvellePopulation.length < this.taillePopulation) {
        // Sélectionner les parents
        const parents = this.selection();
        
        // Appliquer le croisement avec une certaine probabilité
        let enfants;
        if (Math.random() < this.tauxCroisement) {
          enfants = this.croisement(parents[0].edt, parents[1].edt);
        } else {
          // Sinon, copier les parents
          enfants = [
            this.cloner(parents[0].edt),
            this.cloner(parents[1].edt)
          ];
        }
        
        // Appliquer la mutation
        enfants = enfants.map(enfant => this.mutation(enfant));
        
        // Ajouter les enfants à la nouvelle population
        enfants.forEach(enfant => {
          if (nouvellePopulation.length < this.taillePopulation) {
            nouvellePopulation.push({
              edt: enfant,
              fitness: critiries.evaluerFitness(enfant)
            });
          }
        });
      }
      
      // Remplacer l'ancienne population
      this.population = nouvellePopulation;
      this.trierPopulation();
      
      // Enregistrer la meilleure solution de cette génération
      this.meilleuresSolutions.push({
        generation: this.generation,
        edt: this.population[0].edt,
        fitness: this.population[0].fitness
      });
    }
    
    // Retourner la meilleure solution trouvée
    return this.getMeilleureSolution();
  }
  
  // Trier la population par fitness
  trierPopulation() {
    this.population.sort((a, b) => b.fitness - a.fitness);
  }
  
  // Sélection des parents par tournoi
  selection() {
    const selectionTournoi = () => {
      // Sélectionner aléatoirement k individus et prendre le meilleur
      const k = 3; // taille du tournoi
      const indices = [];
      
      while (indices.length < k) {
        const idx = Math.floor(Math.random() * this.population.length);
        if (!indices.includes(idx)) {
          indices.push(idx);
        }
      }
      
      // Trouver le meilleur parmi les sélectionnés
      let meilleurIdx = indices[0];
      for (let i = 1; i < indices.length; i++) {
        if (this.population[indices[i]].fitness > this.population[meilleurIdx].fitness) {
          meilleurIdx = indices[i];
        }
      }
      
      return this.population[meilleurIdx];
    };
    
    // Sélectionner deux parents
    return [selectionTournoi(), selectionTournoi()];
  }
  
  // Croisement de deux emplois du temps
  croisement(parent1, parent2) {
    
    // Pour simplifier, on échange une partie des seance entre les deux parents
    const enfant1 = this.cloner(parent1);
    const enfant2 = this.cloner(parent2);
    
    // Point de croisement aléatoire
    const pointCroisement = Math.floor(Math.random() * parent1.seance.length);
    
    // Pour enfant1, prendre les seance de parent1 jusqu'au point puis ceux de parent2
    enfant1.seance = [
      ...parent1.seance.slice(0, pointCroisement),
      ...parent2.seance.slice(pointCroisement)
    ];
    
    // Pour enfant2, l'inverse
    enfant2.seance = [
      ...parent2.seance.slice(0, pointCroisement),
      ...parent1.seance.slice(pointCroisement)
    ];
    
    return [enfant1, enfant2];
  }
  
  // Mutation d'un emploi du temps
  mutation(edt) {
    const edtMute = this.cloner(edt);
    
    // Pour chaque seance, appliquer une mutation avec une certaine probabilité
    edtMute.seance.forEach((seance, index) => {
      if (Math.random() < this.tauxMutation) {
        // Choisir aléatoirement un type de mutation
        const typeMutation = Math.floor(Math.random() * 3);
        
        switch (typeMutation) {
          case 0: // Changer l'heure de début
            seance.heureDebut = 8 + Math.floor(Math.random() * 10); // Entre 8h et 17h
            seance.heureFin = seance.heureDebut + (seance.heureFin - seance.heureDebut);
            break;
          case 1: // Changer le jour
            const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
            seance.jour = jours[Math.floor(Math.random() * jours.length)];
            break;
          case 2: // Changer la salle
            seance.salle = 'Salle' + (Math.floor(Math.random() * edtMute.salles.length) + 1);
            break;
        }
      }
    });
    
    return edtMute;
  }
  // Cloner un emploi du temps pour éviter les modifications par référence
  cloner(edt) {
    const clone = new edt(); // Recrée une instance
    Object.assign(clone, JSON.parse(JSON.stringify(edt))); // Copie les données
    return clone;
  }
  
  // Obtenir la meilleure solution trouvée
  getMeilleureSolution() {
    return this.population[0];
  }
  
  // Obtenir les statistiques sur l'évolution
  getStatistiques() {
    return {
      generation: this.generation,
      meilleuresSolutions: this.meilleuresSolutions,
      populationActuelle: this.population.map(p => p.fitness)
    };
  }
}

module.exports = AlgorithmeGenetique;