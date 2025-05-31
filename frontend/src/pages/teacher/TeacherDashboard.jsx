import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Building, AlertTriangle, HomeIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import axios from 'axios';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchTeacherData = async () => {
    try {
      const res = await axios.get(`http://localhost:8888/api/professeur/by-email/${user.email}`);
      setTeacher(res.data);
    } catch (error) {
      console.error('Erreur lors de la récupération du professeur :', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.email) {
    fetchTeacherData();
  }

  console.log("Données user : ", user);
}, [user?.email]);


  if (loading) {
    return <div className="text-center mt-20">Chargement...</div>;
  }

  if (!teacher) {
    return <div className="text-center mt-20 text-red-500">Aucune donnée trouvée pour ce professeur.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-lime-500 hover:text-lime-400">
              <HomeIcon className="h-4 w-4 mr-1" />
              Accueil
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar: Profil */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:w-1/3 lg:w-1/4"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
                    <img
                      src={"/image1.jpeg"} // pas de photo dans la base
                      alt={teacher.nom}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{teacher.nom} {teacher.prénom}</h2>
                  <p className="text-gray-600">{teacher.spécialité}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{teacher.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-gray-900">{teacher.telephone || '+33 1 23 45 67 89'}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    to="/teacher/profile"
                    className="block w-full py-2 px-4 text-center bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors"
                  >
                    Modifier mon profil
                  </Link>
                  <Link
                    to="/teacher/timetable"
                    className="block w-full py-2 px-4 text-center bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Mon emploi du temps
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Contenu principal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full md:w-2/3 lg:w-3/4"
            >
              {/* Bannière bienvenue */}
              <div className="bg-gradient-to-r from-gray-700 to-lime-500 rounded-lg shadow-md p-6 text-white mb-6">
                <h1 className="text-2xl font-bold mb-2">Bienvenue, {teacher.nom} {teacher.prénom}</h1>
                <p className="text-blue-100">
                  Gérez votre emploi du temps et vos absences depuis votre espace personnel.
                </p>
              </div>

              {/* Bloc "Cours d'aujourd'hui" — désactivé temporairement */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-lime-600" />
                  Cours d'aujourd'hui
                </h2>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">Module en cours de développement</p>
                </div>
              </div>

              {/* Actions rapides */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-lime-600" />
                    Absences
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Déclarez vos absences à l'avance pour permettre une meilleure organisation.
                  </p>
                  <Link
                    to="/teacher/absence"
                    className="inline-flex items-center text-lime-600 hover:text-lime-800"
                  >
                    Gérer mes absences
                    <svg className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-lime-600" />
                    Réservation
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Réserver une salle à l'avance pour permettre une meilleure organisation.
                  </p>
                  <Link
                    to="/teacher/reservation"
                    className="inline-flex items-center text-lime-600 hover:text-lime-800"
                  >
                    Gérer mes Réservations
                    <svg className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TeacherDashboard;
