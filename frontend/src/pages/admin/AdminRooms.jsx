import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { Home as HomeIcon, Plus, Edit, Trash2, Search, X, Building } from 'lucide-react';

const AdminRooms = () => {
  const [roomsList, setRoomsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null);
  const [formData, setFormData] = useState({
    id_salle: '',
    capacité: 30
  });
  const [formErrors, setFormErrors] = useState({});

  // Configuration Axios
  const api = axios.create({
    baseURL: 'http://localhost:8888/api/salles/',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Fetch rooms from API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await api.get('get');
        setRoomsList(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des salles');
        console.error('Error fetching rooms:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Safe filtering of rooms
  const filteredRooms = roomsList.filter(room => {
    const roomId = room?.id_salle?.toString().toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return roomId.includes(search);
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;

    // Parse numeric values
    if (name === 'capacité') {
      parsedValue = parseInt(value) || 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));

    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.id_salle.trim()) {
      errors.id_salle = "L'identifiant de la salle est requis";
    }

    if (formData.capacité <= 0) {
      errors.capacité = 'La capacité doit être supérieure à 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit with API calls
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    setIsLoading(true);
    setError(null);

    if (editRoomId) {
      await api.put(`update?id=${editRoomId}`, formData);
      setRoomsList(prev => 
        prev.map(room => 
          room.id_salle === editRoomId ? { ...room, ...formData } : room
        )
      );
    } else {
      await api.post('add', formData);
      // Solution 1 : Rechargement complet des données
      const response = await api.get('get');
      setRoomsList(response.data);
    }

    resetForm();
  } catch (err) {
    setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
  } finally {
    setIsLoading(false);
  }
};

  // Reset form and hide it
  const resetForm = () => {
    setFormData({
      id_salle: '',
      capacité: 30
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditRoomId(null);
  };

  // Start editing a room
  const handleEdit = (room) => {
    setFormData({
      id_salle: room.id_salle,
      capacité: room.capacité
    });
    setEditRoomId(room.id_salle);
    setShowAddForm(true);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a room with API call
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      try {
        setIsLoading(true);
        await api.delete(`delete?id=${id}`);
        setRoomsList(prev => prev.filter(room => room.id_salle !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression');
        console.error('Error deleting room:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && roomsList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des salles...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center text-red-600 p-4 bg-red-50 rounded-lg max-w-md mx-auto">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700"
            >
              Réessayer
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="inline-flex items-center text-sm text-lime-500 hover:text-lime-600">
                <HomeIcon className="h-4 w-4 mr-1" />
                Tableau de bord
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-800">Gestion des salles</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Building className="h-6 w-6 mr-2 text-lime-600" />
                Gestion des salles
              </h1>

              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditRoomId(null);
                  if (showAddForm) {
                    resetForm();
                  }
                }}
                className="px-4 py-2 flex items-center bg-lime-500 text-white rounded-md hover:bg-lime-600 transition-colors"
                disabled={isLoading}
              >
                {showAddForm ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une salle
                  </>
                )}
              </button>
            </div>

            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {editRoomId ? 'Modifier la salle' : 'Ajouter une nouvelle salle'}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="id_salle" className="block text-sm font-medium text-gray-700 mb-1">
                          ID Salle*
                        </label>
                        <input
                          type="text"
                          id="id_salle"
                          name="id_salle"
                          value={formData.id_salle}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.id_salle ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Ex: S101"
                          disabled={isLoading}
                        />
                        {formErrors.id_salle && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.id_salle}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="capacité" className="block text-sm font-medium text-gray-700 mb-1">
                          Capacité*
                        </label>
                        <input
                          type="number"
                          id="capacité"
                          name="capacité"
                          value={formData.capacité}
                          onChange={handleInputChange}
                          min="1"
                          className={`block w-full px-4 py-2 border ${formErrors.capacité ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                          disabled={isLoading}
                        />
                        {formErrors.capacité && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.capacité}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        disabled={isLoading}
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {editRoomId ? 'Mise à jour...' : 'Ajout...'}
                          </span>
                        ) : (
                          editRoomId ? 'Mettre à jour' : 'Ajouter'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            <div className="flex items-center mb-6">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Rechercher une salle..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              {filteredRooms.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-200 shadow-md">
                  <thead>
                    <tr className="text-left">
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">ID Salle</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Capacité</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map((room) => (
                      <tr key={room.id_salle} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{room.id_salle}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{room.capacité}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleEdit(room)}
                            className="text-lime-600 hover:text-lime-800"
                            disabled={isLoading}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(room.id_salle)}
                            className="text-red-600 hover:text-red-800 ml-4"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? 'Aucune salle ne correspond à votre recherche' : 'Aucune salle disponible'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminRooms;