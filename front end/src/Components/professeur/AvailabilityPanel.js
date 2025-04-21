import React, { useState, useEffect } from 'react';
import Footer from './common/Footer';
import NoData from './common/NoData';
import { useAppContext } from './context/Contextapp';

function AvailabilityPanel() {
  const { 
    reservations, 
    absences, 
    sallesDisponibles,
    errorMessage,
    successMessage,
    createReservation,
    createAbsence,
    clearMessages
  } = useAppContext();
  
  const [formData, setFormData] = useState({
    date: '',
    heureDebut: '',
    heureFin: '',
    salle: '',
    classe: '',
    motif: '',
  });
  
  // Effacer les messages après 3 secondes
  useEffect(() => {
    if (errorMessage || successMessage) {
      const timer = setTimeout(() => {
        clearMessages();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [errorMessage, successMessage, clearMessages]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleReservation = (e) => {
    e.preventDefault();
    
    const success = createReservation(formData);
    
    if (success) {
      // Réinitialiser le formulaire
      setFormData({
        date: '',
        heureDebut: '',
        heureFin: '',
        salle: '',
        classe: '',
        motif: '',
      });
    }
  };
  
  const handleAbsence = (e) => {
    e.preventDefault();
    
    const success = createAbsence(formData);
    
    if (success) {
      // Réinitialiser le formulaire
      setFormData({
        date: '',
        heureDebut: '',
        heureFin: '',
        salle: '',
        classe: '',
        motif: '',
      });
    }
  };
  
  return (
    <div className="availability-panel">
      <h2>Gérer les Absences & Réservation</h2>
      
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <div className="form-container">
        <form onSubmit={handleReservation}>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input 
                type="date" 
                name="date" 
                value={formData.date} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Heure début</label>
              <input 
                type="time" 
                name="heureDebut" 
                value={formData.heureDebut} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Heure fin</label>
              <input 
                type="time" 
                name="heureFin" 
                value={formData.heureFin} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Salle</label>
              <select 
                name="salle" 
                value={formData.salle} 
                onChange={handleInputChange} 
                required
              >
                <option value="">Sélectionner une salle</option>
                {sallesDisponibles.map(salle => (
                  <option key={salle} value={salle}>{salle}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Classe</label>
              <input 
                type="text" 
                name="classe" 
                value={formData.classe} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Motif</label>
              <input 
                type="text" 
                name="motif" 
                value={formData.motif} 
                onChange={handleInputChange} 
              />
            </div>
            <div className="form-group">
              <button type="submit" className="reserve-btn">Réserver</button>
              <button 
                type="button" 
                className="absence-btn"
                onClick={handleAbsence}
                style={{ 
                  marginTop: '10px', 
                  backgroundColor: '#ff9800', 
                  color: 'white',
                  padding: '10px 15px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Signaler absence
              </button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="lists-container">
        <div className="list-box">
          <h3>Réservation</h3>
          {reservations.length > 0 ? (
            <ul className="reservations-list">
              {reservations.map(res => (
                <li key={res.id}>
                  <strong>{res.date}</strong> - {res.heureDebut} à {res.heureFin}
                  <br />
                  {res.salle}, Classe: {res.classe}
                </li>
              ))}
            </ul>
          ) : (
            <NoData />
          )}
        </div>
        
        <div className="list-box">
          <h3>Absences</h3>
          {absences.length > 0 ? (
            <ul className="absences-list">
              {absences.map(abs => (
                <li key={abs.id}>
                  <strong>{abs.date}</strong> - {abs.heureDebut} à {abs.heureFin}
                  <br />
                  {abs.salle}, Motif: {abs.motif}
                </li>
              ))}
            </ul>
          ) : (
            <NoData />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default AvailabilityPanel;