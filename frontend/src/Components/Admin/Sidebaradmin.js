import React from 'react';

function SidebarAdmin({ currentView, setCurrentView }) {
  // Fonction pour changer la vue
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="col-md-2 bg-light sidebar p-0" style={{ minHeight: '100vh', borderRight: '1px solid #ddd' }}>
       <div className="logo">
        <img src="/logo.png" alt="EduHighTech" />
        <span>Nawabigh</span>
      </div>
      <div className="p-3 text-muted">Menu principal</div>
      <ul className="nav flex-column">
        {/* Home menu item */}
        <li 
          className={`nav-item ${currentView === 'Home' ? 'active' : ''}`}
          onClick={() => handleViewChange('Home')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-home"></i> Home
        </li>
        
        {/* Emploi de temps menu item */}
        <li 
          className={`nav-item ${currentView === 'Emploi' ? 'active' : ''}`}
          onClick={() => handleViewChange('Emploi')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-calendar-alt text-success"></i> Emploi de temps
        </li>
        
        {/* Classes menu item */}
        <li 
          className={`nav-item ${currentView === 'Classes' ? 'active' : ''}`}
          onClick={() => handleViewChange('Classes')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-graduation-cap text-success"></i> Classes
        </li>
        
        {/* Professeurs menu item */}
        <li 
          className={`nav-item ${currentView === 'Professeurs' ? 'active' : ''}`}
          onClick={() => handleViewChange('Professeurs')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-chalkboard-teacher text-success"></i> Professeurs
        </li>

        {/* Salles menu item */}
        <li 
          className={`nav-item ${currentView === 'Salles' ? 'active' : ''}`}
          onClick={() => handleViewChange('Salles')}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-door-open text-success"></i> Salles
        </li>
      </ul>
    </div>
  );
}

export default SidebarAdmin;
