import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [role, setRole] = useState('admin'); // Valeur par défaut
  const [erreur, setErreur] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErreur('');  // Réinitialiser l'erreur à chaque nouvelle tentative

    try {
      const reponse = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: motDePasse, role }),
      });

      const data = await reponse.json();

      if (reponse.ok) {
        localStorage.setItem('token', data.token);
        // Redirection selon le rôle
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'teacher') {
          navigate('/teacher');
        }
      } else {
        setErreur(data.message || 'Erreur de connexion');
      }
    } catch (error) {
      setErreur('Une erreur est survenue');
    } finally {
      setIsLoading(false); // Fin de chargement
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Connexion</h2>

        {erreur && <p className="error-message">{erreur}</p>}

        <div className="input-group">
          <label>Type d'utilisateur</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        <div className="input-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
          />
        </div>
            <p className="forgot-password">
              <a href="/forgot-password">Mot de passe oublié ?</a>
            </p>

        <button type="submit" disabled={isLoading || !email || !motDePasse}>
             {isLoading ? 'Chargement...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
};

export default Login;
