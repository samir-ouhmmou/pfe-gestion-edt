import React, { useState } from 'react';
import './login.css'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setMessage('');
    setIsLoading(true);

    try {
      const reponse = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await reponse.json();

      if (reponse.ok) {
        setMessage(data.message || 'Un email de réinitialisation a été envoyé.');
      } else {
        setErreur(data.message || 'Erreur lors de la demande.');
      }
    } catch (error) {
      setErreur('Une erreur est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Mot de passe oublié</h2>

        {message && <p className="success-message">{message}</p>}
        {erreur && <p className="error-message">{erreur}</p>}

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={isLoading || !email}>
          {isLoading ? 'Envoi en cours...' : 'Envoyer un lien de réinitialisation'}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
