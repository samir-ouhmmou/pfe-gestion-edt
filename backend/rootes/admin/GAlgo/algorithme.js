const criteres = require('./critiries');
const edt = require('./edt');

class AlgorithmeGenetique {
  constructor(parametres = {}) {
    this.taillePopulation = parametres.taillePopulation || 100;
    this.tauxMutation = parametres.tauxMutation || 0.7;
    this.tauxCroisement = parametres.tauxCroisement || 0.7;
    this.nombreGenerations = parametres.nombreGenerations || 500;
    this.elitisme = parametres.elitisme !== undefined ? parametres.elitisme : true;
    this.nombreElites = parametres.nombreElites || 2;
    
    this.population = [];
    this.meilleuresSolutions = [];
    this.generation = 0;
  }
  
  initialiserPopulation(generateur) {
    this.population = [];
    for (let i = 0; i < this.taillePopulation; i++) {
      const individu = generateur();
      this.population.push({
        edt: individu,
        fitness: criteres.evaluerFitness(individu)
      });
    }
    this.trierPopulation();
  }
  
  executer(generateur, nombreGenerations = this.nombreGenerations) {
    if (this.population.length === 0) {
      this.initialiserPopulation(generateur);
    }
    
    for (let g = 0; g < nombreGenerations; g++) {
      this.generation++;
      
      const nouvellePopulation = [];
      
      if (this.elitisme) {
        for (let i = 0; i < this.nombreElites; i++) {
          nouvellePopulation.push(this.population[i]);
        }
      }
      
      while (nouvellePopulation.length < this.taillePopulation) {
        const parents = this.selection();
        
        let enfants;
        if (Math.random() < this.tauxCroisement) {
          enfants = this.croisement(parents[0].edt, parents[1].edt);
        } else {
          enfants = [
            this.cloner(parents[0].edt),
            this.cloner(parents[1].edt)
          ];
        }
        
        enfants = enfants.map(enfant => this.mutation(enfant));
        
        enfants.forEach(enfant => {
          if (nouvellePopulation.length < this.taillePopulation) {
            nouvellePopulation.push({
              edt: enfant,
              fitness: criteres.evaluerFitness(enfant)
            });
          }
        });
      }
      
      this.population = nouvellePopulation;
      this.trierPopulation();
      
      this.meilleuresSolutions.push({
        generation: this.generation,
        edt: this.population[0].edt,
        fitness: this.population[0].fitness
      });
    }
    
    return this.getMeilleureSolution();
  }
  
  trierPopulation() {
    this.population.sort((a, b) => b.fitness - a.fitness);
  }
  
  selection() {
    const selectionTournoi = () => {
      const k = 3;
      const indices = [];
      
      while (indices.length < k) {
        const idx = Math.floor(Math.random() * this.population.length);
        if (!indices.includes(idx)) {
          indices.push(idx);
        }
      }
      
      let meilleurIdx = indices[0];
      for (let i = 1; i < indices.length; i++) {
        if (this.population[indices[i]].fitness > this.population[meilleurIdx].fitness) {
          meilleurIdx = indices[i];
        }
      }
      
      return this.population[meilleurIdx];
    };
    
    return [selectionTournoi(), selectionTournoi()];
  }
  
  croisement(parent1, parent2) {
    const enfant1 = this.cloner(parent1);
    const enfant2 = this.cloner(parent2);
    
    const pointCroisement = Math.floor(Math.random() * parent1.seance.length);
    
    enfant1.seance = [
      ...parent1.seance.slice(0, pointCroisement),
      ...parent2.seance.slice(pointCroisement)
    ];
    
    enfant2.seance = [
      ...parent2.seance.slice(0, pointCroisement),
      ...parent1.seance.slice(pointCroisement)
    ];
    
    return [enfant1, enfant2];
  }
  
  mutation(edt) {
    const edtMute = this.cloner(edt);
    
    edtMute.seance.forEach((seance, index) => {
      if (Math.random() < this.tauxMutation) {
        const typeMutation = Math.floor(Math.random() * 3);
        
        switch (typeMutation) {
          case 0:
             const duree = seance.heureFin - seance.heureDebut;
             seance.heureDebut = 8 + Math.floor(Math.random() * 10);
             seance.heureFin = seance.heureDebut + duree;
             break;
          case 1:
            const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
            seance.jour = jours[Math.floor(Math.random() * jours.length)];
            break;
          case 2:
            seance.salle = edtMute.salles[Math.floor(Math.random() * edtMute.salles.length)].id;
            break;
        }
      }
    });
    
    return edtMute;
  }
  
  cloner(edt) {
    const clone = new edt.constructor();
    
    clone.professeurs = [...edt.professeurs];
    clone.groupe = [...edt.groupe];
    clone.salles = [...edt.salles];
    clone.matieres = [...edt.matieres];
    clone.seance = edt.seance.map(s => ({...s}));
    
    return clone;
  }
  
  getMeilleureSolution() {
    return this.population[0];
  }
  
  getStatistiques() {
    return {
      generation: this.generation,
      meilleuresSolutions: this.meilleuresSolutions,
      populationActuelle: this.population.map(p => p.fitness)
    };
  }
}

module.exports = AlgorithmeGenetique;