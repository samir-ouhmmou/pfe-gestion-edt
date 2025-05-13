import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { BookOpen, HomeIcon, Plus, Edit, Trash2, Search, X } from 'lucide-react';

const AdminClasses = () => {
  const [classesList, setClassesList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editClassId, setEditClassId] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    niveau: '',
    id_salle: ''
  });
  const [formErrors, setFormErrors] = useState({});
  //use effect pour les niveau
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/niveau/get');
        setLevels(response.data);
      } catch (err) {
        console.error('Error fetching levels:', err);
      }
    };
    fetchLevels();
  }, []);
  // 3. Ajoutez cette fonction pour compter les classes par niveau
  const countClassesByLevel = (levelId) => {
    return classesList.filter(cls => cls.niveau === levelId).length;
  };

  // Fetch classes from API
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get('http://localhost:8888/api/classes/get');
        setClassesList(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors du chargement des classes');
        console.error('Error fetching classes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Safe filtering of classes
  const filteredClasses = classesList.filter(cls => {
    const className = cls?.nom?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return className.includes(search);
  });

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

    if (!formData.nom.trim()) {
      errors.nom = 'Le nom est requis';
    }

    if (!formData.niveau) {
      errors.niveau = 'Le niveau est requis';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit:
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      const requestData = {
        nom: formData.nom,
        niveau: formData.niveau,
        id_salle: formData.id_salle ? parseInt(formData.id_salle) : null
      };

      if (editClassId) {
        await axios.put(`http://localhost:8888/api/classes/update?id=${editClassId}`, requestData);
        setClassesList(prev =>
          prev.map(cls =>
            cls.id_classe === editClassId
              ? { ...cls, ...requestData }
              : cls
          )
        );
      } else {
        const response = await axios.post('http://localhost:8888/api/classes/add', requestData);
        //mise ajour
        if (response.data && response.data.id_classe) {
          setClassesList(prev => [...prev, {
            id_classe: response.data.id_classe,
            nom: response.data.nom,
            niveau: response.data.niveau,
            id_salle: response.data.id_salle
          }]);
        } else {
          // Si la réponse est différente, rechargez toutes les classes
          const refreshResponse = await axios.get('http://localhost:8888/api/classes/get');
          setClassesList(refreshResponse.data);
        }
      }

      resetForm();
      setError(null);
    } catch (err) {
      console.error('Full error details:', {
        error: err,
        response: err.response,
        request: err.request
      });
      setError(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form and hide it
  const resetForm = () => {
    setFormData({
      nom: '',
      niveau: '',
      id_salle: ''
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditClassId(null);
  };

  // Start editing a class
  const handleEdit = (cls) => {
    setFormData({
      nom: cls.nom || '',
      niveau: cls.niveau || '',
      id_salle: cls.id_salle || ''
    });
    setEditClassId(cls.id_classe);
    setShowAddForm(true);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a class
  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette classe ?')) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:8888/api/classes/delete?id=${id}`);
        setClassesList(prev => prev.filter(cls => cls.id_classe !== id));
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur lors de la suppression');
        console.error('Error deleting class:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isLoading && classesList.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des classes...</p>
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
              <span className="text-gray-800">Gestion des classes</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <BookOpen className="h-6 w-6 mr-2 text-lime-600" />
                Gestion des classes
              </h1>

              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditClassId(null);
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
                        <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom de la classe*
                        </label>
                        <input
                          type="text"
                          id="nom"
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                          disabled={isLoading}
                        />
                        {formErrors.nom && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.nom}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="niveau" className="block text-sm font-medium text-gray-700 mb-1">
                          Niveau*
                        </label>
                        <input
                          type="text"
                          id="niveau"
                          name="niveau"
                          value={formData.niveau}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.niveau ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                          disabled={isLoading}
                        />
                        {formErrors.niveau && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.niveau}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="id_salle" className="block text-sm font-medium text-gray-700 mb-1">
                          ID Salle
                        </label>
                        <input
                          type="number"
                          id="id_salle"
                          name="id_salle"
                          value={formData.id_salle}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          disabled={isLoading}
                        />
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
                            {editClassId ? 'Mise à jour...' : 'Ajout...'}
                          </span>
                        ) : (
                          editClassId ? 'Mettre à jour' : 'Ajouter'
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
                  placeholder="Rechercher une classe..."
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
              {filteredClasses.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Classe
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Niveau
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salle
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredClasses
                      .sort((a, b) => a.id_classe - b.id_classe)
                      .map((cls) => (
                        <tr key={cls.id_classe} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cls.id_classe}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{cls.nom || 'Non spécifié'}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {cls.niveau || 'Non spécifié'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {cls.id_salle || 'Non spécifié'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(cls)}
                              className="text-lime-600 hover:text-lime-900 mr-4"
                              disabled={isLoading}
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(cls.id_classe)}
                              className="text-red-600 hover:text-red-900"
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
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">
                    {searchTerm ? 'Aucune classe ne correspond à votre recherche' : 'Aucune classe disponible'}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="h-5 w-5 mr-2 text-lime-600" />
              Niveaux scolaires
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {levels.map(level => (
                <div key={level.id_niveau} className="bg-gray-50 rounded-lg p-4 text-center">
                  <span className="text-lg font-semibold text-gray-900">
                    {level.niveau}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminClasses;