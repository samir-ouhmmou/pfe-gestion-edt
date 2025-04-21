import React from 'react';

function Header({ onLoginClick}) {
  return (
    <header className="header">
      <div className="header-logo">
        <img src='logo.png' alt='erreur' />
      </div>

      <nav className="nav-links">
        <a href="./">Accueil</a>
        <a href="./">Fonctionnalité</a>
        <a href="mailto:imane.aabouz@gmail.com">Contact</a>
      </nav>

      <button className="login-button" onClick={onLoginClick}>
        Se connecter
      </button>
    </header>
  );
}

export default Header;
