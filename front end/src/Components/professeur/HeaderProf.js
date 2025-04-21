import React from 'react';
import { useAppContext } from './context/Contextapp';

function HeaderProf() {
  const { user } = useAppContext();

  return (
    <div className="headerProf d-flex justify-content-between align-items-center p-2">
      <div className="search-bar">
        <input type="text" className="form-control" placeholder="Rechercher..." />
      </div>

      <div className="user-info d-flex align-items-center gap-3">
        {/* Cloche de notification avec badge */}
        <div className="position-relative">
          <i className="bi bi-bell fs-4 text-secondary"></i>
          <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle">
          </span>
        </div>

        {/* Icône message (optionnelle) */}
        <i className="fas fa-envelope fs-5 text-secondary"></i>

        {/* Profil utilisateur */}
        <div className="user-profile d-flex align-items-center">
          <img
            src="/image1.jpeg"
            alt="Profile"
            className="rounded-circle me-2"
            style={{ width: '35px', height: '35px', objectFit: 'cover' }}
          />
          <div className="d-flex flex-column">
            <span className="fw-semibold">Madame {user.prenom} {user.nom}</span>
            <span className="text-success small">Professeur</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeaderProf;
