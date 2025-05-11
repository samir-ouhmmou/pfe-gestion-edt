import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../Components/common/Header';
import Footer from '../Components/common/Footer';
import axios from 'axios';

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/reset-password', {
        token,
        password,
      });

      setMessage(response.data.message);
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.message || "Erreur lors de la réinitialisation.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Réinitialiser le mot de passe</h2>

          {message && (
            <div className="mb-4 text-sm text-center text-red-600 bg-red-100 p-2 rounded">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Nouveau mot de passe</label>
              <input
                type="password"
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Confirmer le mot de passe</label>
              <input
                type="password"
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-lime-600 text-white py-2 rounded hover:bg-lime-700 transition duration-200"
            >
              Réinitialiser
            </button>
          </form>
        </div>
      
      </div>
      <Footer />
    </div>
  );
}

export default ResetPassword;
