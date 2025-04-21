import React from 'react';

function Sidebar({ currentView, setCurrentView }) {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src="/logo.png" alt="EduHighTech" />
        <span>Nawabigh</span>
      </div>
      <div className="menu-principale">
        <div className="menu-title">Menu principale</div>
        <ul>
          <li 
            className={currentView === 'profile' ? 'active' : ''} 
            onClick={() => setCurrentView('profile')}
          >
            <i className="fas fa-home"></i> Home
          </li>
          <li 
            className={currentView === 'emploi' ? 'active' : ''} 
            onClick={() => setCurrentView('emploi')}
          >
            <i className="fas fa-calendar"></i> Emploi du temps
          </li>
          <li 
            className={currentView === 'disponibilites' ? 'active' : ''} 
            onClick={() => setCurrentView('disponibilites')}
          >
            <i className="fas fa-clock"></i> Disponibilités
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;