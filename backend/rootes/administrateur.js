const express = require('express');
const connection = require('../connection');
const router = express.Router();
require('dotenv').config();

router.get('/generate-automatic', async (req,res) => {
    try {
        const classes = await   getClasses();
        const salles = await getSalles();
        const  profs = await getProfs();
        const matiers = await getMatiers();
        const creneaux = await getCreneaux();
        
        const data = {
            classes,
            salles,
            profs,
            matiers,
            creneaux
        };
        //generer emploi du temps
        const EDT = generate(data);
        res.status(200).json({
            succes : true,
            message : "Emploi du temps générer avec succes",
            data : EDT
        });    
    } catch (error) {
        console.error("Erreur mors de la génération de l'emploi du temps :",error);
        res.status(500).json({
            success : false,
            message : "Erreur lors de génération d'emplois du temps"
        });
    }
});
//functions pour récupére data
//les classes
async function   getClasses() {
    return new Promise((resolve , reject) => {
       connection.query("select * from classe",(err , results) => {
            if(err) return reject(err);
            resolve(resolve);
        });
    });
}
//les salles
async function getSalles() {
    return new Promise((resolve , reject) => {
        connection.query("select * from salle",(err , results) => {
            if(err) return reject(err);
            resolve(resolve);
        });
    });
}
//les Profs
async function getProfs() {
    return new Promise((resolve , reject) => {
        connection.query("select * from Professeur",(err , results) => {
            if(err) return reject(err);
            resolve(resolve);
        });
    });
}
//les Matiers
async function getMatiers() {
    return new Promise((resolve , reject) => {
        connection.query("select * from Matiere",(err , results) => {
            if(err) return reject(err);
            resolve(resolve);
        });
    });
}
//les créneaux horaire
async function getCreneaux() {
    return new Promise((resolve , reject) => {
        connection.query("select * from Creneau",(err , results) => {
            if(err) return reject(err);
            resolve(resolve);
        });
    });
}
function generate(data){
    const populationSize = 50;
    let population = initializePopulation( data , populationSize );
    //ici le nombre de génération
    const maxGenerations = 100;
    for (let gener = 0 ; gener < maxGenerations ; gener++ ){
        population = evaluerFitness(population , data) ;
        const selected = selection(population);
        const offspring = crossover(selected,data);
        population = mutation(offpspring , data);

        //affiche dans la console la mielleur fit
        if(gener % 10 === 0) {
            console.log('génération ${gener}: meilleur fitness = ${getBest(population).fitness}');

        }
    }
    const bestResults = getBest(population);
    return bestResults.EDT;
}
    //initializePopulation()
  function initializePopulation(data,size){
    const population = [];
    for(let i = 0 ; i < size ; i++ ){
        const EDT = creatEDTaleatoire(data);
        population.push({
            EDT,
            fitness : 0 //ghanhsbou wahd chwya
        });

    }
    return population;
  }
  //create EDT aleatoire
  function creatEDTaleatoire(data){
    const EDT = [];
    data.classes.forEach(classe => {
        data.creneaux.forEach(creneau =>{
            const matiere = selectAeatoire(data.matiers);
            //nchofo les profs
            const profsDisponibles = data.profs.filter(prof => 
                prof.matieres_id.includes(matiere.id) || !matiere.id); //
              const prof = selectAleatoire(profsDisponibles) || selectAleatoire(data.profs);
              const salle = selectAleatoire(data.salles);
              EDT.push({
                classe_id: classe.id,
                creneau_id: creneau.id,
                matiere_id: matiere.id,
                prof_id: prof ? prof.id : null,
                salle_id: salle.id
        });
    });
});
    return EDT;
}

function selectAleatoire(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
    }
//evaluation de fitness
function evaluerFitness(population, data) {
    return population.map(individu => {
      const fitness = calculerFitness(individu.EDT, data);
      return { ...individu, fitness };
    });
  }
  ///////////ghid adlkmgh

    function calculerFitness(EDT , data) {
    let score = 1000; // Score de départ
    
    // conflits de professeurs
    const conflitsProfs = compterConflitsProfs(EDT);
    score -= conflitsProfs * 50;
    
    //conflits de salles
    const conflitsSalles = compterConflitsSalles(EDT);
    score -= conflitsSalles * 50;
    
    // conflits de classes 
    const conflitsClasses = compterConflitsClasses(EDT);
    score -= conflitsClasses * 50;
    
    //  professeurs assignés à des matières qu'ils ne peuvent pas enseigner
    const conflitsMatieresProfs = compterConflitsMatieresProfs(EDT, data);
    score -= conflitsMatieresProfs * 30;
    
    // les trous dans l'emploi du temps des classes
    const trousClasses = compterTrousClasses(EDT, data);
    score -= trousClasses * 10;
    
    return Math.max(score, 0); //  fitness ne peut pas être négatif
  }
  
  // Fonctions pour le calcul de fitness
  function compterConflitsProfs(EDT) {
    const conflicts = {};
    let count = 0;
    
    EDT.forEach(cours => {
      const key = `${cours.prof_id}_${cours.creneau_id}`;
      if (conflicts[key]) {
        count++;
      } else {
        conflicts[key] = true;
      }
    });
    
    return count;
  }
  
  function compterConflitsSalles(EDT) {
    const conflicts = {};
    let count = 0;
    
    EDT.forEach(cours => {
      const key = `${cours.salle_id}_${cours.creneau_id}`;
      if (conflicts[key]) {
        count++;
      } else {
        conflicts[key] = true;
      }
    });
    
    return count;
  }
  
  function compterConflitsClasses(EDT) {
    const conflicts = {};
    let count = 0;
    
    EDT.forEach(cours => {
      const key = `${cours.classe_id}_${cours.creneau_id}`;
      if (conflicts[key]) {
        count++;
      } else {
        conflicts[key] = true;
      }
    });
    
    return count;
  }
  
  function compterConflitsMatieresProfs(EDT, data) {
    let count = 0;
    EDT.forEach(cours => {
      const prof = data.profs.find(p => p.id === cours.prof_id);
      if (prof && cours.matiere_id) {
        // Vérifiez si le professeur peut enseigner cette matière
        // Cette implémentation dépend de votre structure de données
        const peutEnseigner = prof.matieres_id && prof.matieres_id.includes(cours.matiere_id);
        if (!peutEnseigner) {
          count++;
        }
      }
    });
    return count;
  }
  
  function compterTrousClasses(EDT, data) {
    let count = 0;
    // Cette fonction est plus complexe
    // Implémentation simplifiée
    return count;
  }
  
  // Sélection des meilleurs individus
  function selection(population) {
    // Trier la population par fitness 
    const sorted = [...population].sort((a, b) => b.fitness - a.fitness);
    
    // Sélection des 50% meilleurs individus
    const halfSize = Math.floor(population.length / 2);
    return sorted.slice(0, halfSize);
  }
  
  // Croisement pour créer de nouveaux individus
  function crossover(selected, data) {
    const offspring = [...selected]; // On garde les parents
    
    while (offspring.length < 50) { // la taille de population souhaitée
      // Sélection de deux parents
      const parent1Index = Math.floor(Math.random() * selected.length);
      let parent2Index;
      do {
        parent2Index = Math.floor(Math.random() * selected.length);
      } while (parent1Index === parent2Index);
      
      const parent1 = selected[parent1Index];
      const parent2 = selected[parent2Index];
      
      // Point de croisement
      const crossPoint = Math.floor(Math.random() * parent1.EDT.length);
      
      // Création des enfants
      const enfant1EDT = [
        ...parent1.EDT.slice(0, crossPoint),
        ...parent2.EDT.slice(crossPoint)
      ];
      
      offspring.push({
        EDT: enfant1EDT,
        fitness: 0 // Sera calculé plus tard
      });
    }
    
    return offspring;
  }
  
  // Mutation pour introduire de la diversité
  function mutation(population, data) {
    const tauxMutation = 0.1; // 10% de chance de mutation
    
    return population.map(individu => {
      // Copie profonde de l'emploi du temps
      const EDTMute = JSON.parse(JSON.stringify(individu.EDT));
      
      // Pour chaque cours, on a une chance de le muter
      EDTMute.forEach((cours, index) => {
        if (Math.random() < tauxMutation) {
          // Type de mutation aléatoire
          const typeMutation = Math.floor(Math.random() * 3);
          
          switch (typeMutation) {
            case 0: // Changer de salle
              cours.salle_id = selectAleatoire(data.salles).id;
              break;
            case 1: // Changer de professeur
              const profsDisponibles = data.profs.filter(prof => 
                !prof.matieres_id || prof.matieres_id.includes(cours.matiere_id));
              const nouveauProf = selectAleatoire(profsDisponibles || data.profs);
              if (nouveauProf) cours.prof_id = nouveauProf.id;
              break;
            case 2: // Changer de matière
              const nouvelleMat = selectAleatoire(data.matieres);
              cours.matiere_id = nouvelleMat.id;
              break;
          }
        }
      });
      
      return {
        EDT: EDTMute,
        fitness: 0 // Sera recalculé
      };
    });
  }
  
  // Récupérer le meilleur individu
  function getBest(population) {
    return population.reduce((best, current) => 
      current.fitness > best.fitness ? current : best, population[0]);
  }  
  

  
module.exports = router ;