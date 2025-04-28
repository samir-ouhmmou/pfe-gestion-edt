import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Header from '../Components/common/Header';
import Footer from '../Components/common/Footer';
import { School, Loader } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

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
  

  // const setExampleCredentials = (type) => {
  //   if (type === 'teacher') {
  //     setEmail('teacher@school.com');
  //     setPassword('password');
  //   } else {
  //     setEmail('admin@school.com');
  //     setPassword('password');
  //   }
  // };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md"
        >
          <div>
            <div className="flex justify-center">
              <School className="h-12 w-12 text-lime-600" />
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Connectez-vous à votre compte
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Accédez à l'espace administrateur ou professeur
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
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
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Adresse email"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Mot de passe</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Mot de passe"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                  Mot de passe oublié ?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-lime-500 hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 disabled:bg-lime-400"
              >
                {isLoading && <Loader className="animate-spin h-5 w-5 mr-2" />}
                Se connecter
              </button>
            </div>
          </form>

          <div className="mt-4">
            {/* <p className="text-sm text-gray-600 mb-2">Comptes de démonstration :</p> */}
            {/* <div className="flex space-x-2">
              <button
                onClick={() => setExampleCredentials('teacher')}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-800"
              >
                Professeur
              </button>
              <button
                onClick={() => setExampleCredentials('admin')}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-800"
              >
                Administrateur
              </button>
            </div> */}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default LoginPage;
