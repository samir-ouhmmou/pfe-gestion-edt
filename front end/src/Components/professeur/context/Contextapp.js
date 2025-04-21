import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({
    nom: 'BATOU',
    prenom: 'Amal',
    email: 'amal.battou@gmail.com',
    mobile: '06 57 81 28 58',
    CIN: 'JE 321 155',
    specialite: 'Français & Mathématique'
  });
  
  const [reservations, setReservations] = useState([]);
  const [absences, setAbsences] = useState([]);
  const [sallesDisponibles, setSallesDisponibles] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Simuler des données pour démonstration
  useEffect(() => {
    // Données fictives pour les salles disponibles
    setSallesDisponibles(['Salle A101', 'Salle B202', 'Salle C303', 'Laboratoire 1']);
  }, []);

  // Fonction pour créer une réservation
  const createReservation = (formData) => {
    // Vérifier si la salle est disponible (simulation)
    const isSalleDisponible = Math.random() > 0.3; // 70% de chance que la salle soit disponible
    
    if (isSalleDisponible) {
      // Ajouter la réservation
      const newReservation = {
        ...formData,
        id: Date.now()
      };
      
      setReservations([...reservations, newReservation]);
      setSuccessMessage('Réservation effectuée avec succès !');
      setErrorMessage('');
      return true;
    } else {
      setErrorMessage('Désolé, cette salle n\'est pas disponible à ce créneau horaire.');
      setSuccessMessage('');
      return false;
    }
  };
  
  // Fonction pour créer une absence
  const createAbsence = (formData) => {
    const newAbsence = {
      ...formData,
      id: Date.now()
    };
    
    setAbsences([...absences, newAbsence]);
    setSuccessMessage('Absence enregistrée, la salle est maintenant disponible.');
    return true;
  };
  
  // Effacer les messages
  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const value = {
    user,
    setUser,
    reservations,
    setReservations,
    absences,
    setAbsences,
    sallesDisponibles,
    errorMessage,
    successMessage,
    createReservation,
    createAbsence,
    clearMessages
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};