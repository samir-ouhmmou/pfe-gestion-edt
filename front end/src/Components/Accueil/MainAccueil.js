import React from 'react';
import './MainAccueil.css';
import { motion } from 'framer-motion';


function afficherInfos(){
  const infos = document.getElementById('infosApp');
  if(infos){
    infos.classList.add('show');
    infos.scrollIntoView({behavior: 'smooth' });
  }
}
function MainAccueil() {
  return (
    <section className="main-container">
      <div className="main-text">
        <div className='titre'>
          <h1>Application web de gestion des emplois du temps</h1>
        </div>
        
        <p>
          Transformez la gestion manuelle de vos emploi du temps en une gestion automatisée
        </p>
        <p className="citation">
          "L'innovation est ce qui distingue un leader d'un suiveur."
           – Steve Jobs
        </p>

        <div className="main-buttons">
          <button onClick={() => window.location.href = '/consulter'} className="btn-consulte">Consulter l’emploi du temps</button>
          <button onClick={afficherInfos} className="btn-en-savoir-plus">En savoir plus sur nous</button>

        </div>
        <div id="infosApp" className="infos-section hidden">
              <h2>À propos de notre application</h2>
              <p>
                Cette application web a été conçue pour simplifier la gestion des emplois du temps au sein d’une école primaire privée. Elle offre une solution moderne, pratique et intuitive pour organiser les horaires des classes et des enseignants.
              </p>
              <p>
                Grâce à son interface conviviale, l’administration peut créer, modifier et consulter les emplois du temps en toute simplicité. Les enseignants peuvent accéder à leur planning personnalisé, et les parents comme les élèves peuvent consulter facilement les horaires.
              </p>
              <h3>✔️ Les avantages de notre application :</h3>
              <ul>
                <li>🎯 Interface simple et facile à utiliser</li>
                <li>📅 Création rapide et efficace des emplois du temps</li>
                <li>👨‍🏫 Accès sécurisé pour les professeurs et l’administration</li>
                <li>🌐 Consultation publique de l’emploi du temps pour tous</li>
                <li>⏱️ Gain de temps et réduction des erreurs manuelles</li>
              </ul>
            </div>
      </div>

      <div className="main-image">
        <img src="/imageAccuiel.jpeg" alt="Enfants école" />
      </div>
    </section>
  );
}

export default MainAccueil;
