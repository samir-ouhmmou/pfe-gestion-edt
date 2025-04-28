import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { classes, classLevels } from '../../utils/timetableData';
import { BookOpen, HomeIcon, Plus, Edit, Trash2, Search, X } from 'lucide-react';

const AdminClasses = () => {
  const [classesList, setClassesList] = useState([...classes]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editClassId, setEditClassId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    levelId: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Filter classes based on search term
  const filteredClasses = classesList.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.levelId) {
      errors.levelId = 'Le niveau est requis';
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

    if (editClassId) {
      // Update existing class
      setClassesList(prev =>
        prev.map(cls =>
          cls.id === editClassId
            ? {
              ...cls,
              name: formData.name,
              levelId: formData.levelId
            }
            : cls
        )
      );

      setEditClassId(null);
    } else {
      // Add new class
      // Generate a new ID based on level and existing classes
      const level = classLevels.find(l => l.id === formData.levelId);
      const levelClasses = classesList.filter(c => c.levelId === formData.levelId);
      const suffix = String.fromCharCode(65 + levelClasses.length); // A, B, C, etc.
      const newId = `${formData.levelId}-${suffix.toLowerCase()}`;

      const newClass = {
        id: newId,
        name: formData.name,
        levelId: formData.levelId,
      };

      setClassesList(prev => [...prev, newClass]);
    }

    // Reset form
    resetForm();
  };

  // Reset form and hide it
  const resetForm = () => {
    setFormData({
      name: '',
      levelId: '',
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditClassId(null);
  };

  // Start editing a class
  const handleEdit = (cls) => {
    setFormData({
      name: cls.name,
      levelId: cls.levelId,
    });
    setEditClassId(cls.id);
    setShowAddForm(true);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a class
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      setClassesList(prev => prev.filter(cls => cls.id !== id));
    }
  };

  // Get level name by ID
  const getLevelName = (levelId) => {
    const level = classLevels.find(l => l.id === levelId);
    return level ? level.name : 'Inconnu';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
                <HomeIcon className="h-4 w-4 mr-1" />
                Tableau de bord
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-800">Gestion des classes</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-blue-600" />
                Gestion des classes
              </h1>

              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditClassId(null);
                  if (showAddForm) {
                    setFormData({
                      name: '',
                      levelId: '',
                    });
                    setFormErrors({});
                  }
                }}
                className="px-4 py-2 flex items-center bg-green-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {showAddForm ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une classe
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
                    {editClassId ? 'Modifier la classe' : 'Ajouter une nouvelle classe'}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de la classe*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="levelId" className="block text-sm font-medium text-gray-700 mb-1">
                          Niveau*
                        </label>
                        <select
                          id="levelId"
                          name="levelId"
                          value={formData.levelId}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.levelId ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-green-500 focus:border-green-500`}
                        >
                          <option value="">Sélectionner un niveau</option>
                          {classLevels.map(level => (
                            <option key={level.id} value={level.id}>
                              {level.name}
                            </option>
                          ))}
                        </select>
                        {formErrors.levelId && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.levelId}</p>
                        )}
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
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        {editClassId ? 'Mettre à jour' : 'Ajouter'}
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
                  placeholder="Rechercher une classe..."
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
              {filteredClasses.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classe
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Niveau
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClasses
                      .sort((a, b) => {
                        // Sort by level first, then by name
                        if (a.levelId !== b.levelId) {
                          return a.levelId.localeCompare(b.levelId);
                        }
                        return a.name.localeCompare(b.name);
                      })
                      .map((cls) => (
                        <tr key={cls.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{cls.name}</div>
                            <div className="text-sm text-gray-500">{cls.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {getLevelName(cls.levelId)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(cls)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(cls.id)}
                              className="text-red-600 hover:text-red-900"
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
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? 'Aucune classe ne correspond à votre recherche' : 'Aucune classe disponible'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Levels Management Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
              Niveaux scolaires
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {classLevels.map(level => {
                const levelClassCount = classesList.filter(cls => cls.levelId === level.id).length;

                return (
                  <div key={level.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">{level.name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {levelClassCount} {levelClassCount > 1 ? 'classes' : 'classe'}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">ID: {level.id}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminClasses;
