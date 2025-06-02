import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { rooms } from '../../utils/timetableData';
import axios from 'axios';
import {
  Calendar, HomeIcon, Building, Clock, Trash2, CheckCircle, X
} from 'lucide-react';

const RoomReservation = () => {
  const { user } = useAuth();
  const [isReserving, setIsReserving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [reservationForm, setReservationForm] = useState({
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    room: '',
    reason: '',
  });
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    if (user?.id) fetchReservations();
  }, [user]);

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`http://localhost:8888/api/reservation/${user.id}`);
      setReservations(res.data);
    } catch (err) {
      console.error("Erreur chargement réservations:", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationForm({ ...reservationForm, [name]: value });
  };

  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    const { startDate, endDate, startTime, endTime, room, reason } = reservationForm;

    if (!startDate || !endDate || !startTime || !endTime || !room || !reason) {
      return setFormError("Veuillez remplir tous les champs.");
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    if (start > end) {
      return setFormError("L'heure de début doit précéder l'heure de fin.");
    }

    try {
      await axios.post('http://localhost:8888/api/reservation', {
        startDate,
        endDate,
        startTime,
        endTime,
        reason,
        room,
        id_prof: user.id
      });

      setFormSuccess("Réservation envoyée avec succès.");
      setReservationForm({ startDate: '', endDate: '', startTime: '', endTime: '', room: '', reason: '' });
      fetchReservations();
    } catch (err) {
      console.error("Erreur ajout réservation:", err);
      setFormError(err.response?.data?.message || "Erreur serveur");
    }
  };

  const handleDeleteReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:8888/api/reservation/${id}`);
      fetchReservations();
    } catch (err) {
      console.error("Erreur suppression réservation:", err);
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('fr-FR');

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/teacher" className="inline-flex items-center text-sm text-lime-600 hover:text-lime-800">
                <HomeIcon className="h-4 w-4 mr-1" /> Tableau de bord
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-800">Réservation de salles</span>
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
                    <Building className="h-5 w-5 mr-2 text-lime-500" /> Mes réservations
                  </h2>
                  <button onClick={() => setIsReserving(!isReserving)}
                    className="px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600 flex items-center">
                    {isReserving ? (<><X className="h-4 w-4 mr-2" />Annuler</>) : (<><Calendar className="h-4 w-4 mr-2" />Réserver</>)}
                  </button>
                </div>

                {isReserving && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-50 p-4 rounded-lg mb-6">
                    {formError && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{formError}</p>
                      </div>
                    )}
                    <form onSubmit={handleReservationSubmit}>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Date début</label>
                          <input type="date" name="startDate" value={reservationForm.startDate} onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded-md" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Date fin</label>
                          <input type="date" name="endDate" value={reservationForm.endDate} onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded-md" required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Heure début</label>
                          <input type="time" name="startTime" value={reservationForm.startTime} onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded-md" required />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Heure fin</label>
                          <input type="time" name="endTime" value={reservationForm.endTime} onChange={handleInputChange}
                            className="w-full border px-3 py-2 rounded-md" required />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Salle</label>
                        <select name="room" value={reservationForm.room} onChange={handleInputChange}
                          className="w-full border px-3 py-2 rounded-md" required>
                          <option value="">Choisir une salle</option>
                          {rooms.map((room) => (
                            <option key={room.id} value={room.id}>{room.name}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Motif</label>
                        <textarea name="reason" rows="3" value={reservationForm.reason} onChange={handleInputChange}
                          className="w-full border px-3 py-2 rounded-md" required />
                      </div>

                      <div className="flex justify-end">
                        <button type="submit" className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700">
                          Soumettre
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {reservations.length > 0 ? (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <motion.div key={reservation.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-gray-700">Salle ID: {reservation.room}</p>
                            <p className="text-sm text-gray-700">
                              Du {formatDate(reservation.startDate)} au {formatDate(reservation.endDate)}
                            </p>
                            <p className="text-gray-600 mb-2">{reservation.reason}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-2" />
                              Créée le {formatDate(reservation.createdAt)}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(reservation.status)}`}>
                              {reservation.status?.charAt(0).toUpperCase() + reservation.status?.slice(1).toLowerCase()}
                            </span>
                            {reservation.status?.toLowerCase() === 'en attente' && (
                              <button onClick={() => handleDeleteReservation(reservation.id)}
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
                  <p className="text-gray-500">Aucune réservation pour le moment.</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RoomReservation;
