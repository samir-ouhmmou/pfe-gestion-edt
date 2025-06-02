import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { getTeacherTimetable, classes } from '../../utils/timetableData';
import axios from 'axios';
import {
  Calendar, HomeIcon, AlertTriangle, Clock, Trash2, CheckCircle, X
} from 'lucide-react';

const TeacherAbsence = () => {
  const { user } = useAuth();
  const [absenceDeclarations, setAbsenceDeclarations] = useState([]);
  const [isDeclaringAbsence, setIsDeclaringAbsence] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [absenceForm, setAbsenceForm] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchAbsences(user.id);
    }
  }, [user]);

  const fetchAbsences = async (id_prof) => {
    try {
      const res = await axios.get(`http://localhost:8888/api/absence/${id_prof}`);
      setAbsenceDeclarations(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des absences :", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAbsenceForm({ ...absenceForm, [name]: value });
  };

  const handleAbsenceSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!absenceForm.startDate || !absenceForm.endDate || !absenceForm.reason) {
      return setFormError("Veuillez remplir tous les champs.");
    }

    if (!user?.id) {
      return setFormError("Erreur : professeur non identifié.");
    }

    try {
      await axios.post('http://localhost:8888/api/absence', {
        startDate: absenceForm.startDate,
        endDate: absenceForm.endDate,
        reason: absenceForm.reason,
        id_prof: user.id
      });

      setFormSuccess("Votre déclaration a été soumise.");
      setAbsenceForm({ startDate: '', endDate: '', reason: '' });
      setIsDeclaringAbsence(false);
      fetchAbsences(user.id);
    } catch (err) {
      console.error("Erreur détaillée:", err.response?.data);
      setFormError(err.response?.data?.message || "Erreur lors de la soumission");
    }
  };

  const handleDeleteAbsence = async (id) => {
    try {
      await axios.delete(`http://localhost:8888/api/absence/${id}`);
      fetchAbsences(user.id);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  const getStatusBadgeClass = (status) => {
    const normalized = status?.toLowerCase();
    switch (normalized) {
      case 'validé':
      case 'validée':
      case 'approuvé':
        return 'bg-green-100 text-green-800';
      case 'refusé':
      case 'refusée':
      case 'rejeté':
        return 'bg-red-100 text-red-800';
      case 'en attente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString('fr-FR');
  const timetableData = user ? getTeacherTimetable(user.id) : [];
  const getClassName = (classId) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : 'Classe inconnue';
  };
  const getUpcomingClasses = () => timetableData.slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/teacher" className="inline-flex items-center text-sm text-lime-500 hover:text-lime-600">
                <HomeIcon className="h-4 w-4 mr-1" />
                Tableau de bord
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-800">Gestion des absences</span>
            </div>
          </div>

          {formSuccess && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              <p>{formSuccess}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-lime-600" />
                    Mes déclarations d'absence
                  </h2>
                  <button
                    onClick={() => setIsDeclaringAbsence(!isDeclaringAbsence)}
                    className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 flex items-center"
                  >
                    {isDeclaringAbsence ? (<><X className="h-4 w-4 mr-2" />Annuler</>) : (<><AlertTriangle className="h-4 w-4 mr-2" />Déclarer une absence</>)}
                  </button>
                </div>

                {isDeclaringAbsence && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle déclaration</h3>
                      {formError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                          <p>{formError}</p>
                        </div>
                      )}
                      <form onSubmit={handleAbsenceSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
                            <input type="date" name="startDate" value={absenceForm.startDate} onChange={handleInputChange}
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md" required />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
                            <input type="date" name="endDate" value={absenceForm.endDate} onChange={handleInputChange}
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md" required />
                          </div>

                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Motif</label>
                          <textarea name="reason" rows="3" value={absenceForm.reason} onChange={handleInputChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md" required />
                        </div>

                        <div className="flex justify-end">
                          <button type="submit" className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700">
                            Soumettre
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {absenceDeclarations.length > 0 ? (
                  <div className="space-y-4">
                    {absenceDeclarations.map(absence => (
                      <motion.div key={absence.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-700">
                                Du {formatDate(absence.startDate)} au {formatDate(absence.endDate)}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{absence.reason}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-2" />
                              Créée le {formatDate(absence.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(absence.status)}`}>
                              {absence.status.charAt(0).toUpperCase() + absence.status.slice(1).toLowerCase()}
                            </span>
                            {absence.status.toLowerCase() === 'en attente' && (
                              <button onClick={() => handleDeleteAbsence(absence.id)}
                                className="ml-4 text-red-600 hover:text-red-800">
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-2" />
                    Aucune déclaration pour l’instant.
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-lime-600" />
                  Prochains cours
                </h3>
                <div className="space-y-3">
                  {getUpcomingClasses().map((entry) => (
                    <div key={entry.id} className="flex p-3 border border-gray-200 rounded-lg">
                      <div className="w-20 text-center border-r pr-3">
                        <p className="text-gray-900 font-medium">{entry.startTime}</p>
                        <p className="text-xs text-gray-500">{entry.day}</p>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{entry.subject}</p>
                        <p className="text-gray-600">{getClassName(entry.classId)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
                <div className="space-y-4 text-gray-600">
                  <p className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Déclarez à l'avance (48h minimum).</p>
                  <p className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Les absences sont examinées par la direction.</p>
                  <p className="flex items-start"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> En cas d’urgence, contactez le secrétariat.</p>
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

export default TeacherAbsence;
