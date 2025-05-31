import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { teachers, getTeacherTimetable, rooms, classes } from '../../utils/timetableData';
import { Calendar, HomeIcon, AlertTriangle, Clock, Trash2, CheckCircle, X } from 'lucide-react';

const TeacherAbsence = () => {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const [isDeclaringAbsence, setIsDeclaringAbsence] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const [absenceForm, setAbsenceForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });
  
  const [absenceDeclarations, setAbsenceDeclarations] = useState([
    {
      id: '1',
      startDate: '2025-03-15',
      endDate: '2025-03-15',
      reason: 'Rendez-vous médical',
      status: 'approved',
      createdAt: '2025-03-10T09:30:00',
    },
    {
      id: '2',
      startDate: '2025-04-05',
      endDate: '2025-04-07',
      reason: 'Formation professionnelle',
      status: 'pending',
      createdAt: '2025-03-25T14:15:00',
    },
  ]);
  
  const timetableData = getTeacherTimetable(teacher.id);
  
  const getClassName = (classId) => {
    const classObj = classes.find(c => c.id === classId);
    return classObj ? classObj.name : 'Classe non trouvée';
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAbsenceForm({
      ...absenceForm,
      [name]: value,
    });
  };
  
  const handleAbsenceSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!absenceForm.startDate || !absenceForm.endDate || !absenceForm.reason) {
      setFormError('Veuillez remplir tous les champs.');
      return;
    }
    
    const startDate = new Date(absenceForm.startDate);
    const endDate = new Date(absenceForm.endDate);
    
    if (startDate > endDate) {
      setFormError('La date de début doit être antérieure à la date de fin.');
      return;
    }
    
    const newAbsence = {
      id: (absenceDeclarations.length + 1).toString(),
      startDate: absenceForm.startDate,
      endDate: absenceForm.endDate,
      reason: absenceForm.reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setAbsenceDeclarations([...absenceDeclarations, newAbsence]);
    setAbsenceForm({
      startDate: '',
      endDate: '',
      reason: '',
    });
    setFormSuccess('Votre déclaration d\'absence a été soumise avec succès.');
    setIsDeclaringAbsence(false);
    
    setTimeout(() => {
      setFormSuccess('');
    }, 3000);
  };
  
  const handleDeleteAbsence = (id) => {
    setAbsenceDeclarations(absenceDeclarations.filter(abs => abs.id !== id));
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  const getUpcomingClasses = () => {
    return timetableData.slice(0, 5);
  };
  
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
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6">
              <p>{formSuccess}</p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-lime-600" />
                    Mes déclarations d'absence
                  </h2>
                  <button
                    onClick={() => setIsDeclaringAbsence(!isDeclaringAbsence)}
                    className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors flex items-center"
                  >
                    {isDeclaringAbsence ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Déclarer une absence
                      </>
                    )}
                  </button>
                </div>

                {isDeclaringAbsence && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle déclaration d'absence</h3>

                      {formError && (
                        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                          <p>{formError}</p>
                        </div>
                      )}

                      <form onSubmit={handleAbsenceSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                              Date de début
                            </label>
                            <input
                              type="date"
                              id="startDate"
                              name="startDate"
                              value={absenceForm.startDate}
                              onChange={handleInputChange}
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>

                          <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                              Date de fin
                            </label>
                            <input
                              type="date"
                              id="endDate"
                              name="endDate"
                              value={absenceForm.endDate}
                              onChange={handleInputChange}
                              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                            Motif de l'absence
                          </label>
                          <textarea
                            id="reason"
                            name="reason"
                            rows="3"
                            value={absenceForm.reason}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          ></textarea>
                        </div>

                        <div className="flex justify-end">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors"
                          >
                            Soumettre
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}

                {absenceDeclarations.length > 0 ? (
                  <div className="space-y-4">
                    {absenceDeclarations.map((absence) => (
                      <motion.div
                        key={absence.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center mb-2">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-gray-700">
                                Du {formatDate(absence.startDate)} au {formatDate(absence.endDate)}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">{absence.reason}</p>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-500">
                                Créée le {new Date(absence.createdAt).toLocaleDateString('fr-FR')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center">
                            {absence.status === 'pending' ? (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                                En attente
                              </span>
                            ) : absence.status === 'approved' ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Approuvée
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                Rejetée
                              </span>
                            )}

                            {absence.status === 'pending' && (
                              <button
                                onClick={() => handleDeleteAbsence(absence.id)}
                                className="ml-4 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-600">Aucune déclaration d'absence pour le moment.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-lime-600" />
                  Prochains cours
                </h3>

                <div className="space-y-3">
                  {getUpcomingClasses().map((entry) => (
                    <div key={entry.id} className="flex p-3 border border-gray-200 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition-colors">
                      <div className="w-20 flex-shrink-0 text-center border-r border-gray-200 pr-3">
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

                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-gray-600">
                      Les déclarations d'absence doivent être soumises au moins 48 heures à l'avance, sauf en cas d'urgence.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-gray-600">
                      La direction examinera votre demande et vous informera de sa décision.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-gray-600">
                      Pour toute urgence, veuillez contacter le secrétariat directement par téléphone.
                    </p>
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

export default TeacherAbsence;