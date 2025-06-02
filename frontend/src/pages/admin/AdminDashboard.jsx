import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Users, Home, BookOpen, Clock, Settings, Server, Download, HomeIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';

const AdminDashboard = () => {
  const { user } = useAuth();

  const [totalProfs, setTotalTeachers] = useState(0);
  const [totalClasses, setTotalClasses] = useState(0);
  const [totalSalles, setTotalSalles] = useState(0);
  const [lastGenerationDate, setLastGenerationDate] = useState(null);
  const [pendingTasks, setPendingTasks] = useState([]);

  const getSchoolYear = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
  };

  const schoolYear = getSchoolYear();

  useEffect(() => {
    const storedDate = localStorage.getItem('lastGenerationDate');
    if (storedDate) {
      setLastGenerationDate(new Date(storedDate).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }));
    }

    const fetchData = async () => {
      try {
        const [resProfs, resClasses, resSalles, resTasks] = await Promise.all([
          axios.get('http://localhost:8888/api/statistics/NbrProfs'),
          axios.get('http://localhost:8888/api/statistics/NbrClasses'),
          axios.get('http://localhost:8888/api/statistics/NbrSalles'),
          axios.get('http://localhost:8888/api/admin/tasks')
        ]);

        setTotalTeachers(resProfs.data.nbrProfs);
        setTotalClasses(resClasses.data.nbrClasses);
        setTotalSalles(resSalles.data.nbrSalles);
        setPendingTasks(resTasks.data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
      }
    };

    fetchData();
  }, []);

  const handleTaskAction = (id, action) => {
    axios.post(`http://localhost:8888/api/admin/tasks/${id}/${action}`)
      .then(() => {
        setPendingTasks(prev => prev.filter(t => t.id !== id));
      })
      .catch(err => console.error("Erreur action tâche :", err));
  };

  const getPriorityClass = (type) => {
    switch (type) {
      case 'absence': return 'bg-red-100 text-red-800';
      case 'reservation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'absence': return <Clock className="h-5 w-5 text-red-600" />;
      case 'reservation': return <Home className="h-5 w-5 text-blue-600" />;
      default: return <Settings className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="inline-flex items-center text-sm text-lime-500 hover:text-lime-600">
                <HomeIcon className="h-4 w-4 mr-1" />
                Accueil
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-800">Administration</span>
            </div>
          </div>

          {/* Bannière de bienvenue */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-gray-700 to-lime-500 rounded-lg shadow-md p-6 text-white mb-6"
          >
            <h1 className="text-2xl font-bold mb-2">Bienvenue, {user?.name}</h1>
            <p className="text-blue-100">
              Gérez les emplois du temps et ressources de l'école depuis votre tableau de bord.
            </p>
          </motion.div>

          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
          >
            <StatCard icon={<Users className="h-8 w-8 text-blue-600" />} title="Professeurs" value={totalProfs} link="/admin/teachers" delay={0.1} />
            <StatCard icon={<BookOpen className="h-8 w-8 text-emerald-600" />} title="Classes" value={totalClasses} link="/admin/classes" delay={0.2} />
            <StatCard icon={<Home className="h-8 w-8 text-amber-600" />} title="Salles" value={totalSalles} link="/admin/rooms" delay={0.3} />
            <StatCard icon={<Server className="h-8 w-8 text-violet-600" />} title="Niveaux" value="6" link="/admin/classes" delay={0.4} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Actions principales + tâches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Actions principales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ActionCard icon={<Calendar className="h-10 w-10 text-blue-600" />} title="Génération automatique" description="Générer automatiquement les emplois du temps" link="/admin/timetable" primary />
                  <ActionCard icon={<Settings className="h-10 w-10 text-emerald-600" />} title="Gestion manuelle" description="Modifier les emplois du temps" link="/admin/timetablemanuelle" />
                  <ActionCard icon={<Users className="h-10 w-10 text-amber-600" />} title="Gestion des professeurs" description="Ajouter ou modifier des professeurs" link="/admin/teachers" />
                  <ActionCard icon={<Home className="h-10 w-10 text-violet-600" />} title="Gestion des salles" description="Gérer les salles" link="/admin/rooms" />
                </div>
              </div>

              {/* Tâches en attente */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Tâches en attente</h2>
                  <Link to="#" className="text-sm text-lime-500 hover:text-lime-600">Voir tout</Link>
                </div>

                <div className="space-y-4">
                  {pendingTasks.length === 0 && (
                    <p className="text-gray-500">Aucune tâche en attente</p>
                  )}

                  {pendingTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        {getTaskIcon(task.type)}
                        <div>
                          <p className="font-medium text-gray-800">
                            {task.type === 'absence' ? 'Absence' : 'Réservation'} du prof {task.id_prof}<br />
                            <span className="text-sm text-gray-500">{task.startDate} → {task.endDate}</span>
                          </p>
                          <p className="text-sm text-gray-600 italic">Motif : {task.reason}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleTaskAction(task.id, 'accept')} className="text-green-600 hover:underline text-sm">Valider</button>
                        <button onClick={() => handleTaskAction(task.id, 'reject')} className="text-red-600 hover:underline text-sm">Refuser</button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Accès rapide + état système */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Accès rapide</h2>
                <div className="space-y-3">
                  <QuickAccessLink icon={<Calendar className="h-5 w-5 text-blue-600" />} title="Consulter les emplois du temps" link="/admin/timetable" />
                  <QuickAccessLink icon={<Download className="h-5 w-5 text-emerald-600" />} title="Exporter les emplois du temps" link="/admin/timetable" />
                  <QuickAccessLink icon={<Users className="h-5 w-5 text-amber-600" />} title="Liste des professeurs" link="/admin/teachers" />
                  <QuickAccessLink icon={<BookOpen className="h-5 w-5 text-violet-600" />} title="Liste des classes" link="/admin/classes" />
                  <QuickAccessLink icon={<Home className="h-5 w-5 text-red-600" />} title="Liste des salles" link="/admin/rooms" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">État du système</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Dernière génération</span>
                    <span className="text-gray-900">{lastGenerationDate || 'Aucune génération'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Année scolaire</span>
                    <span className="text-gray-900">{schoolYear}</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">État général</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Opérationnel</span>
                  </div>
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

const StatCard = ({ icon, title, value, link, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }} className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">{icon}</div>
    </div>
    <div className="mt-4">
      <Link to={link} className="text-sm text-lime-600 hover:text-lime-800">Voir tout</Link>
    </div>
  </motion.div>
);

const ActionCard = ({ icon, title, description, link, primary }) => (
  <Link to={link} className={`block p-6 border rounded-lg hover:shadow-md transition-all ${primary ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' : 'bg-white border-gray-200 hover:border-blue-200 hover:bg-blue-50'}`}>
    <div className="flex flex-col items-start">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="inline-flex items-center text-lime-600 hover:text-lime-800">
        <span>En savoir plus</span>
        <span className="ml-2">&#x2192;</span>
      </div>
    </div>
  </Link>
);

const QuickAccessLink = ({ icon, title, link }) => (
  <Link to={link} className="flex items-center text-sm text-gray-700 hover:text-lime-600 space-x-2">
    <div>{icon}</div>
    <span>{title}</span>
  </Link>
);

export default AdminDashboard;
