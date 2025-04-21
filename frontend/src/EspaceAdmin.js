// src/EspaceAdmin.js
import React, { useState } from 'react';
import Sidebaradmin from './Components/Admin/Sidebaradmin';
import HeaderAdmine from './Components/Admin/HeaderAdmine';
import AdminHome from './Components/Admin/AdminHome';
import ClassesPage from './Components/Admin/ClassesPage';
import ProfesseursPage from './Components/Admin/ProfesseursPage';
import SallesPage from './Components/Admin/SallesPage';
import Emploidetemps from './Components/Admin/Emploidetemps';

//import './Components/Admin/admin.css'; // si tu as un fichier CSS spécifique

const EspaceAdmin = () => {
  const [currentView, setCurrentView] = useState('Home');

  return (
    <div className="admin-container d-flex">
      <Sidebaradmin currentView={currentView} setCurrentView={setCurrentView} />

      <div className="main-content flex-grow-1">
        <HeaderAdmine />
        <div className="content p-4">
          {currentView === 'Home' && <AdminHome />}
          {currentView === 'Emploi de temps' && <Emploidetemps />}
          {currentView === 'Classes' && <ClassesPage />}
          {currentView === 'Professeurs' && <ProfesseursPage />}
          {currentView === 'Salles' && <SallesPage />}
        </div>
      </div>
    </div>
  );
};

export default EspaceAdmin;
