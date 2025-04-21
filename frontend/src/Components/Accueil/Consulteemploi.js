import React, { useState, useEffect } from 'react';
import './Consulteemploi.css';
const Consulteemploi = () => {
  const [niveaux, setNiveaux] = useState(['CP', 'CE1', 'CE2', 'CM1', 'CM2']);
  const [classes, setClasses] = useState([]);
  const [niveauChoisi, setNiveauChoisi] = useState('');
  const [classeChoisie, setClasseChoisie] = useState('');
  const [emploiDuTemps, setEmploiDuTemps] = useState(null);

  useEffect(() => {
    // Appel à ton API pour récupérer les classes dynamiques
    fetch('http://localhost:5000/api/classes')
      .then(res => res.json())
      .then(data => setClasses(data))
      .catch(err => console.error('Erreur chargement classes:', err));
  }, []);

  const handleAfficher = () => {
    // Appel API pour récupérer l’emploi du temps de cette classe
    fetch(`http://localhost:5000/api/emploi/${classeChoisie}`)
      .then(res => res.json())
      .then(data => setEmploiDuTemps(data))
      .catch(err => console.error(err));
  };

  const handlePDF = () => {
    // Redirection vers une route backend qui génère le PDF
    window.open(`http://localhost:5000/api/emploi/${classeChoisie}/pdf`, '_blank');
  };

  return (
    <div className="container">
      <h2>Consulter l’emploi du temps</h2>
      <div className="ligne-actions">
          <select value={niveauChoisi} onChange={(e) => setNiveauChoisi(e.target.value)}>
            <option value="">-- Niveau --</option>
            {niveaux.map(niv => (
              <option key={niv} value={niv}>{niv}</option>
            ))}
          </select>

          <select value={classeChoisie} onChange={(e) => setClasseChoisie(e.target.value)}>
            <option value="">-- Classe --</option>
            {classes
              .filter(c => c.niveau === niveauChoisi)
              .map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
          </select>

          <button className="btn-mini" onClick={handleAfficher}>Afficher</button>
          <button className="btn-mini" onClick={handlePDF} disabled={!classeChoisie}>PDF</button>
          
        </div>


      {emploiDuTemps && (
        <div className="emploi">
          {/* À personnaliser selon la structure de ton emploi */}
          <pre>{JSON.stringify(emploiDuTemps, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Consulteemploi;
