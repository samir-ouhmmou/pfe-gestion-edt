import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Components/Accueil/header';
import MainAccueil from './Components/Accueil/MainAccueil';
import Consulteemploi from './Components/Accueil/Consulteemploi';
import Login from './Components/Accueil/login';
import ForgotPassword from './Components/Accueil/ForgotPassword';
import EspaceAdmin from './EspaceAdmin';
import EspaceProf from './EspaceProf';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function AccueilWithHeader() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <Header onLoginClick={handleLoginClick} />
      <MainAccueil />
    </>
  );
}

function App() {
  const [role, setRole] = useState('');
  const [currentView, setCurrentView] = useState('profile');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AccueilWithHeader />} />
        <Route path="/login" element={<Login />} />
        <Route path="/consulter" element={<Consulteemploi />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Routes admin/prof avec layout */}
        <Route path="/admin/*" element={<EspaceAdmin />} />
        <Route path="/prof/*" element={<EspaceProf />} />
      </Routes>

      {/* Sélecteur de rôle temporaire */}
      <div className="container mt-4">
        <h1>Bienvenue !</h1>

        {!role && (
          <div>
            <button className="btn btn-primary m-2" onClick={() => setRole('admin')}>Se connecter comme Admin</button>
            <button className="btn btn-success m-2" onClick={() => setRole('prof')}>Se connecter comme Prof</button>
          </div>
        )}

        {role === 'admin' && <EspaceAdmin />}
        {role === 'prof' && <EspaceProf />}
      </div>
    </Router>
  );
}

export default App;
