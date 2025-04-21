import React from 'react';
import Footer from './common/Footer';
import NoData from './common/NoData';
import { useAppContext } from './context/Contextapp';

function TimetablePanel() {
  const { reservations } = useAppContext();
  
  return (
    <div className="timetable-panel">
      <h2>Bienvenue Prof !</h2>
      <div className="timetable-content">
        <h3>Mon emploi du temps</h3>
        {reservations.length > 0 ? (
          <div className="timetable-grid">
            {reservations.map(res => (
              <div key={res.id} className="timetable-item">
                <div className="timetable-date">{res.date}</div>
                <div className="timetable-time">{res.heureDebut} - {res.heureFin}</div>
                <div className="timetable-class">{res.classe}</div>
                <div className="timetable-room">{res.salle}</div>
              </div>
            ))}
          </div>
        ) : (
          <NoData />
        )}
      </div>
      <Footer />
    </div>
  );
}

export default TimetablePanel;