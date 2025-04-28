import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { teachers, availableSubjects } from '../../utils/timetableData';
import { Users, HomeIcon, Plus, Edit, Trash2, Search, X, Mail, Phone } from 'lucide-react';

const AdminTeachers = () => {
  const [teachersList, setTeachersList] = useState([...teachers]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editTeacherId, setEditTeacherId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subjects: [],
    phone: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Filter teachers based on search term
  const filteredTeachers = teachersList.filter(teacher => 
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
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

  // Handle subject selection
  const handleSubjectChange = (subject) => {
    setFormData(prev => {
      const subjects = prev.subjects.includes(subject)
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject];
      return { ...prev, subjects };
    });

    // Clear subject error if at least one subject is selected
    if (formErrors.subjects && formData.subjects.length > 0) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.subjects;
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

    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    if (formData.subjects.length === 0) {
      errors.subjects = 'Au moins une matière est requise';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle add teacher
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (editTeacherId) {
      // Update existing teacher
      setTeachersList(prev => 
        prev.map(teacher => 
          teacher.id === editTeacherId 
            ? { 
                ...teacher, 
                name: formData.name, 
                email: formData.email, 
                subjects: formData.subjects, 
                phone: formData.phone 
              } 
            : teacher
        )
      );

      setEditTeacherId(null);
    } else {
      // Add new teacher
      const newTeacher = {
        id: `t${teachersList.length + 1}`,
        name: formData.name,
        email: formData.email,
        subjects: formData.subjects,
        phone: formData.phone,
        image: undefined // No image for new teachers
      };

      setTeachersList(prev => [...prev, newTeacher]);
    }

    // Reset form
    resetForm();
  };

  // Reset form and hide it
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      subjects: [],
      phone: '',
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditTeacherId(null);
  };

  // Start editing a teacher
  const handleEdit = (teacher) => {
    setFormData({
      name: teacher.name,
      email: teacher.email,
      subjects: teacher.subjects,
      phone: teacher.phone || '',
    });
    setEditTeacherId(teacher.id);
    setShowAddForm(true);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete a teacher
  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      setTeachersList(prev => prev.filter(teacher => teacher.id !== id));
    }
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
              <span className="text-gray-800">Gestion des enseignants</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-600" />
                Gestion des enseignants
              </h1>

              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditTeacherId(null);
                  if (showAddForm) {
                    setFormData({
                      name: '',
                      email: '',
                      subjects: [],
                      phone: '',
                    });
                    setFormErrors({});
                  }
                }}
                className="px-4 py-2 flex items-center bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {showAddForm ? (
                  <>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un enseignant
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
                    {editTeacherId ? 'Modifier l\'enseignant' : 'Ajouter un nouvel enseignant'}
                  </h2>

                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${
                            formErrors.name ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`block w-full px-4 py-2 border ${
                            formErrors.email ? 'border-red-500' : 'border-gray-300'
                          } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                        />
                        {formErrors.email && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                        )}
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Matières enseignées*
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {availableSubjects.map(subject => (
                            <label
                              key={subject}
                              className={`flex items-center p-3 rounded-lg border ${
                                formData.subjects.includes(subject)
                                  ? 'bg-blue-50 border-blue-500'
                                  : 'border-gray-300 hover:border-blue-400'
                              } cursor-pointer transition-colors`}
                            >
                              <input
                                type="checkbox"
                                checked={formData.subjects.includes(subject)}
                                onChange={() => handleSubjectChange(subject)}
                                className="sr-only"
                              />
                              <span className={`text-sm ${
                                formData.subjects.includes(subject)
                                  ? 'text-blue-700 font-medium'
                                  : 'text-gray-700'
                              }`}>
                                {subject}
                              </span>
                            </label>
                          ))}
                        </div>
                        {formErrors.subjects && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.subjects}</p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        {editTeacherId ? 'Mettre à jour' : 'Ajouter'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}

            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Nom</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Matières</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredTeachers.map(teacher => (
                    <tr key={teacher.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {teacher.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {teacher.subjects.join(', ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(teacher)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(teacher.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminTeachers;
