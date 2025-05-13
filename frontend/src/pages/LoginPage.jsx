// src/pages/LoginPage.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Header from '../Components/common/Header';
import Footer from '../Components/common/Footer';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setPassword] = useState('');
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, mot_de_passe);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-5 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md"
        >
          <div className="flex flex-col items-center">
            <img src='/logo.png' alt="logo de la plateforme" className="h-40 w-50" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connectez-vous à votre compte
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Accédez à l'espace administrateur ou professeur
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded"
            >
              <div className="flex items-center">
                <ExclamationCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </motion.div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">Adresse email</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                  placeholder="Adresse email"
                />
              </div>
              <div>
                <label htmlFor="mot_de_passe" className="sr-only">Mot de passe</label>
                <input
                  id="mot_de_passe"
                  name="mot_de_passe"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={mot_de_passe}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 sm:text-sm"
                  placeholder="Mot de passe"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="/forgot-password" className="font-medium text-lime-600 hover:text-lime-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:bg-lime-400 transition-colors duration-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : "Se connecter"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;