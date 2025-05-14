import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { availableSubjects } from '../../utils/timetableData';
import { Users, HomeIcon, Plus, Edit, Trash2, Search, X, Mail, Phone, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8888/api';

const AdminTeachers = () => {
  const [teachersList, setTeachersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    spécialités: [],
    telephone: '',
    motDePasse: '',         
    niveaux: []
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/profs/get`);
      // Convertir les spécialités de chaîne à tableau si nécessaire
      const formattedTeachers = response.data.map(teacher => ({
        ...teacher,
        spécialités: teacher.spécialité ? teacher.spécialité.split(' ') : []
      }));
      setTeachersList(formattedTeachers);
      console.log('Données formatées:', formattedTeachers);
    } catch (err) {
      console.error("Erreur lors du chargement:", err);
      setError("Erreur de chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTeachers = teachersList.filter(teacher =>
    teacher.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.spécialités?.some(sp => sp.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubjectChange = (spécialité) => {
    setFormData(prev => {
      const newSpécialités = prev.spécialités.includes(spécialité)
        ? prev.spécialités.filter(s => s !== spécialité)
        : [...prev.spécialités, spécialité];
      return { ...prev, spécialités: newSpécialités };
    });
    if (formErrors.spécialités) {
      setFormErrors(prev => ({ ...prev, spécialités: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nom.trim()) errors.nom = 'Nom requis';
    if (!formData.email.trim()) {
      errors.email = 'Email requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Email invalide';
    }
    if (formData.spécialités.length === 0) errors.spécialités = 'Au moins une matière requise';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
    if (!formData.motDePasse.trim()) {
  errors.motDePasse = 'Mot de passe requis';
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const teacherData = {
        ...formData,
        spécialité: formData.spécialités.join(' '), // Convertir le tableau en chaîne pour l'API
        niveaux: formData.niveaux.join(',')
      };

      if (editTeacherId) {
        await axios.put(`${API_URL}/profs/update?id=${editTeacherId}`, teacherData);
      } else {
        await axios.post(`${API_URL}/profs/add`, teacherData);
      }
      fetchTeachers();
      resetForm();
    } catch (err) {
      console.error("Erreur:", err);
      alert(err.response?.data?.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      email: '',
      spécialités: [],
      telephone: '',
      motDePasse: '',
      niveaux: []
    });

    setFormErrors({});
    setShowAddForm(false);
    setEditTeacherId(null);
  };

  const handleEdit = (teacher) => {
    setFormData({
      nom: teacher.nom,
      email: teacher.email,
      spécialités: teacher.spécialités || [],
      telephone: teacher.telephone || '',
      motDePasse: '', // ne pas pré-remplir pour la sécurité
      niveaux: teacher.niveaux ? teacher.niveaux.split(',') : []
    });

    setEditTeacherId(teacher._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      setIsLoading(true);
      try {
        await axios.delete(`${API_URL}/profs/delete?id=${id}`);
        fetchTeachers();
      } catch (err) {
        console.error("Erreur:", err);
        alert("Échec de la suppression");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

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
              <span className="text-gray-800">Enseignants</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-lime-600" />
                Gestion des enseignants
              </h1>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
               <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-4 py-2 flex items-center bg-lime-600 text-white rounded-md hover:bg-lime-700"
                >
                  {showAddForm ? (
                    <X className="h-4 w-4 mr-2" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  {showAddForm ? 'Annuler' : 'Ajouter'}
                </button>
              </div>
            </div>

            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-8"
              >
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {editTeacherId ? 'Modifier' : 'Ajouter'} un enseignant
                  </h2>
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nom*</label>
                        <input
                          name="nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.nom ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {formErrors.nom && <p className="mt-1 text-sm text-red-600">{formErrors.nom}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe*</label>
                        <input
                          name="motDePasse"
                          type="password"
                          value={formData.motDePasse}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${formErrors.motDePasse ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {formErrors.motDePasse && <p className="mt-1 text-sm text-red-600">{formErrors.motDePasse}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                        <input
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Matières*</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {availableSubjects.map(subject => (
                            <label
                              key={subject}
                              className={`flex items-center p-3 rounded-lg border ${formData.spécialités.includes(subject)
                                ? 'bg-blue-50 border-blue-500'
                                : 'border-gray-300'
                                } cursor-pointer`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.spécialités.includes(subject)}
                                onChange={() => handleSubjectChange(subject)}
                                className="sr-only"
                              />
                              <span className="text-sm">
                                {subject}
                              </span>
                            </label>
                          ))}
                        </div>
                        {formErrors.spécialités && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.spécialités}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Niveaux pris en charge</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {['CP', 'CE1', 'CE2', 'CM1', 'CM2'].map(niveau => (
                            <label
                              key={niveau}
                              className={`flex items-center p-3 rounded-lg border ${formData.niveaux.includes(niveau)
                                ? 'bg-green-50 border-green-500'
                                : 'border-gray-300'} cursor-pointer`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.niveaux.includes(niveau)}
                                onChange={() => {
                                  setFormData(prev => {
                                    const newNiveaux = prev.niveaux.includes(niveau)
                                      ? prev.niveaux.filter(n => n !== niveau)
                                      : [...prev.niveaux, niveau];
                                    return { ...prev, niveaux: newNiveaux };
                                  });
                                }}
                                className="sr-only"
                              />
                              <span className="text-sm">{niveau}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 mr-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600"
                      >
                        {editTeacherId ? 'Mettre à jour' : 'Ajouter'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-lime-500" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Nom</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Matières</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Téléphone</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTeachers.map(teacher => (
                      <tr key={teacher._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {teacher.nom}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-1 text-gray-400" />
                            {teacher.email}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {teacher.spécialités?.map(sp => (
                              <span key={sp} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                {sp}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {teacher.telephone ? (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1 text-gray-400" />
                              {teacher.telephone}
                            </div>
                          ) : (
                            <span className="text-gray-400">Non renseigné</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(teacher)}
                              className="text-lime-600 hover:text-lime-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(teacher._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminTeachers;