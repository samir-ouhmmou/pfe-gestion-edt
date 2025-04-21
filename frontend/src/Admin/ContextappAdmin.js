import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [professeurs, setProfesseurs] = useState([]);
  const [classes, setClasses] = useState([]);
  const [salles, setSalles] = useState([]);

  return (
    <AppContext.Provider value={{ professeurs, setProfesseurs, classes, setClasses, salles, setSalles }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
