import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { rooms } from '../../utils/timetableData';
import { Home as HomeIcon, Plus, Edit, Trash2, Search, X, Building } from 'lucide-react';

const AdminRooms = () => {
  const [roomsList, setRoomsList] = useState([...rooms]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editRoomId, setEditRoomId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: 30,
    building: '',
    floor: 0,
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Filter rooms based on search term
  const filteredRooms = roomsList.filter(room => 
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    room.building.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    // Parse numeric values
    if (name === 'capacity' || name === 'floor') {
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
    
    if (!formData.name.trim()) {
      errors.name = 'Le nom est requis';
    }
    
    if (!formData.building.trim()) {
      errors.building = 'Le bâtiment est requis';
    }
    
    if (formData.capacity <= 0) {
      errors.capacity = 'La capacité doit être supérieure à 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (editRoomId) {
      // Update existing room
      setRoomsList(prev => 
        prev.map(room => 
          room.id === editRoomId 
            ? { 
                ...room, 
                name: formData.name, 
                capacity: formData.capacity, 
                building: formData.building,
                floor: formData.floor
              } 
            : room
        )
      );
      
      setEditRoomId(null);
    } else {
      // Add new room
      // Generate a new ID
      const newRoomId = `r${roomsList.length + 1}`;
      
      const newRoom = {
        id: newRoomId,
        name: formData.name,
        capacity: formData.capacity,
        building: formData.building,
        floor: formData.floor,
      };
      
      setRoomsList(prev => [...prev, newRoom]);
    }
    
    // Reset form
    resetForm();
  };
  
  // Reset form and hide it
  const resetForm = () => {
    setFormData({
      name: '',
      capacity: 30,
      building: '',
      floor: 0,
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditRoomId(null);
  };
  
  // Start editing a room
  const handleEdit = (room) => {
    setFormData({
      name: room.name,
      capacity: room.capacity,
      building: room.building,
      floor: room.floor,
    });
    setEditRoomId(room.id);
    setShowAddForm(true);
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Delete a room
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette salle ?')) {
      setRoomsList(prev => prev.filter(room => room.id !== id));
    }
  };
  
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
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de la salle*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Ex: Salle 101"
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                          Bâtiment*
                        </label>
                        <input
                          type="text"
                          id="building"
                          name="building"
                          value={formData.building}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.building ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Ex: A"
                        />
                        {formErrors.building && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.building}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                          Capacité*
                        </label>
                        <input
                          type="number"
                          id="capacity"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleInputChange}
                          min="1"
                          className={`block w-full px-4 py-2 border ${formErrors.capacity ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {formErrors.capacity && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.capacity}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                          Étage
                        </label>
                        <input
                          type="number"
                          id="floor"
                          name="floor"
                          value={formData.floor}
                          onChange={handleInputChange}
                          min="0"
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700"
                      >
                        {editRoomId ? 'Mettre à jour' : 'Ajouter'}
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
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
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
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Nom</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Capacité</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Bâtiment</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Étage</th>
                      <th className="px-6 py-3 text-sm font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map((room) => (
                      <tr key={room.id} className="border-t border-gray-100">
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{room.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{room.capacity}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{room.building}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{room.floor}</td>
                        <td className="px-6 py-4 text-sm">
                          <button
                            onClick={() => handleEdit(room)}
                            className="text-lime-600 hover:text-lime-800"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
                            className="text-red-600 hover:text-red-800 ml-4"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500">Aucune salle trouvée.</p>
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
