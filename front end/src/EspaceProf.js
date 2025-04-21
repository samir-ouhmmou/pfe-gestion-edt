
import Sidebar from './Components/professeur/Sidebar';
import HeaderProf from './Components/professeur/HeaderProf';
import ProfilePanel from './Components/professeur/ProfilePanel';
import TimetablePanel from './Components/professeur/TimetablePanel';
import AvailabilityPanel from './Components/professeur/AvailabilityPanel';
import { AppProvider } from './Components/professeur/context/Contextapp';
import React, { useState } from 'react';
const EspaceProf = () => {
    const [currentView, setCurrentView] = useState('profile');
    return (
      <div>
        <AppProvider>
            <div className="app">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <div className="main-content">
                <HeaderProf />
                <div className="content">
                {currentView === 'profile' && <ProfilePanel />}
                {currentView === 'emploi' && <TimetablePanel />}
                {currentView === 'disponibilites' && <AvailabilityPanel />}
                </div>
            </div>
            </div>
   </AppProvider>
      </div>
    );
  };
  
  export default EspaceProf;
  