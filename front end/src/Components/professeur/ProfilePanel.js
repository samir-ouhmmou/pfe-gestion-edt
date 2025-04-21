import React from 'react';
import { useAppContext } from './context/Contextapp';

function ProfilePanel() {
  const { user } = useAppContext();
  
  return (
    <div className="profile-panel">
      <h2>Bienvenue Prof !</h2>
      
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            <img src="/logoprof.png" alt="Profile" />
          </div>
          <div className="profile-header-info">
            <h3>Professeur {user.prenom} {user.nom}</h3>
            <p className="profile-speciality">Français & Mathématique</p>
            
            <div className="profile-email">
              <i className="fas fa-envelope"></i>
              <span>{user.email}</span>
            </div>
            
            <button className="change-password-btn">
              Changer le mot de passe
            </button>
          </div>
        </div>
      </div>
      
      <div className="personal-info-card">
        <div className="personal-info-header">
          <h3>Informations personnelles</h3>
          <button className="modify-btn">
            <i className="fas fa-pen"></i> Modifier
          </button>
        </div>
        
        <div className="info-table">
          <div className="info-row">
            <div className="info-label">Nom</div>
            <div className="info-separator">:</div>
            <div className="info-value">{user.nom}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Prénom</div>
            <div className="info-separator">:</div>
            <div className="info-value">{user.prenom}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Adress Email</div>
            <div className="info-separator">:</div>
            <div className="info-value">{user.email}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Mobile</div>
            <div className="info-separator">:</div>
            <div className="info-value">06 57 81 28 58</div>
          </div>
          <div className="info-row">
            <div className="info-label">CIN</div>
            <div className="info-separator">:</div>
            <div className="info-value">JE 321 155</div>
          </div>
        </div>
      </div>
      
      <div className="footer">
        <p>contact@eduhightech.com</p>
      </div>
    </div>
  );
}

export default ProfilePanel;