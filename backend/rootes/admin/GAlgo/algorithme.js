// const { EmploiDuTemps } = require('./edt');
// const { evaluerFitness, estValide } = require('./critiries');

// const genererPopulationInitiale = (taille, config) => {
//   const population = [];
//   for (let i = 0; i < taille; i++) {
//     population.push(EmploiDuTemps.genererAleatoire(config));
//   }
//   return population;
// };

// const selectionner = (population) => {
//   return population
//     .map(edt => ({ edt, fitness: evaluerFitness(edt) }))
//     .sort((a, b) => b.fitness - a.fitness)
//     .slice(0, 10)
//     .map(p => p.edt);
// };

// const croisement = (parent1, parent2) => {
//   const enfant = new EmploiDuTemps();
//   enfant.professeurs = parent1.professeurs;
//   enfant.classes = parent1.classes; // corrigé: groupe -> classes
//   enfant.salles = parent1.salles;
//   enfant.matieres = parent1.matieres;
//   enfant.creneaux = parent1.creneaux;

//   const miLongueur = Math.floor(parent1.seance.length / 2);
//   enfant.seance = [
//     ...parent1.seance.slice(0, miLongueur),
//     ...parent2.seance.slice(miLongueur)
//   ];

//   return enfant;
// };

// const mutation = (edt, config) => {
//   const index = Math.floor(Math.random() * edt.seance.length);
//   const nouvelleSeance = EmploiDuTemps.genererAleatoire(config).seance[0];
//   edt.seance[index] = nouvelleSeance;
//   return edt;
// };

// const algorithmeGenetique = (config, generations = 100) => {
//   let population = genererPopulationInitiale(30, config);

//   for (let gen = 0; gen < generations; gen++) {
//     const parents = selectionner(population);
//     const enfants = [];

//     while (enfants.length < population.length) {
//       const [p1, p2] = [parents[0], parents[1]];
//       let enfant = croisement(p1, p2);

//       if (Math.random() < 0.3) {
//         enfant = mutation(enfant, config);
//       }

//       enfants.push(enfant);
//     }

//     population = enfants;
//   }

//   return selectionner(population)[0];
// };

// module.exports = { algorithmeGenetique };
const { EmploiDuTemps } = require('./edt');
const { evaluerFitness, estValide } = require('./critiries');

const genererPopulationInitiale = (taille, config) => {
  const population = [];
  for (let i = 0; i < taille; i++) {
    population.push(EmploiDuTemps.genererAleatoire(config));
  }
  return population;
};

const selectionner = (population) => {
  return population
    .map(edt => ({ edt, fitness: evaluerFitness(edt) }))
    .sort((a, b) => b.fitness - a.fitness)
    .slice(0, 10)
    .map(p => p.edt);
};

const croisement = (parent1, parent2) => {
  const enfant = new EmploiDuTemps();
  enfant.professeurs = parent1.professeurs;
  enfant.classes = parent1.classes; // corrigé: groupe -> classes
  enfant.salles = parent1.salles;
  enfant.matieres = parent1.matieres;
  enfant.creneaux = parent1.creneaux;

  const miLongueur = Math.floor(parent1.seance.length / 2);
  enfant.seance = [
    ...parent1.seance.slice(0, miLongueur),
    ...parent2.seance.slice(miLongueur)
  ];

  return enfant;
};

const mutation = (edt, config) => {
  const index = Math.floor(Math.random() * edt.seance.length);
  const nouvelleSeance = EmploiDuTemps.genererAleatoire(config).seance[0];
  edt.seance[index] = nouvelleSeance;
  return edt;
};

const algorithmeGenetique = (config, generations = 100) => {
  let population = genererPopulationInitiale(30, config);

  for (let gen = 0; gen < generations; gen++) {
    const parents = selectionner(population);
    const enfants = [];

    while (enfants.length < population.length) {
      const [p1, p2] = [parents[0], parents[1]];
      let enfant = croisement(p1, p2);

      if (Math.random() < 0.3) {
        enfant = mutation(enfant, config);
      }

      enfants.push(enfant);
    }

    population = enfants;
  }

  return selectionner(population)[0];
};

module.exports = { algorithmeGenetique };
