import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { rooms, getRoomTimetable } from '../../utils/timetableData';
import { Calendar, HomeIcon, AlertTriangle, Clock, Trash2, CheckCircle, X } from 'lucide-react';

const RoomReservation = () => {
  const { user } = useAuth();
  const [isReserving, setIsReserving] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  
  const [reservationForm, setReservationForm] = useState({
    startDate: '',
    endDate: '',
    startTime: '', // Ajout de l'heure de début
    endTime: '', // Ajout de l'heure de fin
    room: '',
    reason: '',
  });
  
  const [reservations, setReservations] = useState([
    {
      id: '1',
      room: 'Salle 1',
      startDate: '2025-03-25',
      endDate: '2025-03-25',
      reason: 'Réunion',
      status: 'approved',
      createdAt: '2025-03-10T09:30:00',
    },
    {
      id: '2',
      room: 'Salle 2',
      startDate: '2025-04-05',
      endDate: '2025-04-07',
      reason: 'Formation',
      status: 'pending',
      createdAt: '2025-03-25T14:15:00',
    },
  ]);
  
  const roomData = getRoomTimetable();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReservationForm({
      ...reservationForm,
      [name]: value,
    });
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!reservationForm.startDate || !reservationForm.endDate || !reservationForm.room || !reservationForm.reason || !reservationForm.startTime || !reservationForm.endTime) {
      setFormError('Veuillez remplir tous les champs.');
      return;
    }
    
    const startDate = new Date(`${reservationForm.startDate}T${reservationForm.startTime}`);
    const endDate = new Date(`${reservationForm.endDate}T${reservationForm.endTime}`);
    
    if (startDate > endDate) {
      setFormError('L\'heure de début doit être antérieure à l\'heure de fin.');
      return;
    }
    
    const newReservation = {
      id: (reservations.length + 1).toString(),
      room: reservationForm.room,
      startDate: reservationForm.startDate,
      endDate: reservationForm.endDate,
      startTime: reservationForm.startTime,
      endTime: reservationForm.endTime,
      reason: reservationForm.reason,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    setReservations([...reservations, newReservation]);
    setReservationForm({
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      room: '',
      reason: '',
    });
    setFormSuccess('Votre réservation a été soumise avec succès.');
    
    setTimeout(() => {
      setFormSuccess('');
    }, 3000);
  };

  const handleDeleteReservation = (id) => {
    setReservations(reservations.filter(reservation => reservation.id !== id));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getUpcomingReservations = () => {
    return roomData.slice(0, 5);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/teacher" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                <HomeIcon className="h-4 w-4 mr-1" />
                Tableau de bord
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-800">Gestion des réservations</span>
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
                    <AlertTriangle className="h-5 w-5 mr-2 text-blue-600" />
                    Mes réservations de salle
                  </h2>
                  <button
                    onClick={() => setIsReserving(!isReserving)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  >
                    {isReserving ? (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Annuler
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Réserver une salle
                      </>
                    )}
                  </button>
                </div>

                {isReserving && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Nouvelle réservation</h3>

                    {formError && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{formError}</p>
                      </div>
                    )}

                    <form onSubmit={handleReservationSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Date de réservation
                          </label>
                          <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={reservationForm.startDate}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Heure de début
                          </label>
                          <input
                            type="time"
                            id="startTime"
                            name="startTime"
                            value={reservationForm.startTime}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                            Heure de fin
                          </label>
                          <input
                            type="time"
                            id="endTime"
                            name="endTime"
                            value={reservationForm.endTime}
                            onChange={handleInputChange}
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-1">
                          Choisir une salle
                        </label>
                        <select
                          id="room"
                          name="room"
                          value={reservationForm.room}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        >
                          {rooms.map((room) => (
                            <option key={room.id} value={room.name}>
                              {room.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                          Motif de la réservation
                        </label>
                        <textarea
                          id="reason"
                          name="reason"
                          rows="3"
                          value={reservationForm.reason}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        ></textarea>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                          Soumettre
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {reservations.length > 0 ? (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <motion.div
                        key={reservation.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-semibold">{reservation.room}</p>
                            <p className="text-sm text-gray-600">
                              {formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}
                            </p>
                            <p className="text-sm text-gray-700">{reservation.reason}</p>
                          </div>

                          <div className="flex flex-col items-end">
                            <span className={`text-sm ${reservation.status === 'approved' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {reservation.status === 'approved' ? (
                                <CheckCircle className="h-4 w-4 mr-2" />
                              ) : (
                                <Clock className="h-4 w-4 mr-2" />
                              )}
                              {reservation.status === 'approved' ? 'Approuvé' : 'En attente'}
                            </span>

                            <button
                              onClick={() => handleDeleteReservation(reservation.id)}
                              className="text-red-600 hover:text-red-800 mt-2"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Réservations à venir</h3>
                {getUpcomingReservations().length > 0 ? (
                  <ul>
                    {getUpcomingReservations().map((reservation) => (
                      <li key={reservation.id} className="flex justify-between py-2 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{reservation.room}</p>
                          <p className="text-xs text-gray-600">{formatDate(reservation.startDate)} - {formatDate(reservation.endDate)}</p>
                        </div>
                        <span className="text-sm text-gray-500">{reservation.reason}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">Pas de réservations à venir.</p>
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
