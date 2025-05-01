import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { teachers } from '../../utils/timetableData';
import { User, HomeIcon, Mail, Phone, Key, AlertTriangle } from 'lucide-react';

const TeacherProfile = () => {
  const { user } = useAuth();
  const teacherData = teachers.find(t => t.email === user?.email) || teachers[0];

  const [teacher, setTeacher] = useState({
    name: teacherData.name,
    email: teacherData.email,
    phone: teacherData.phone || '+33 1 23 45 67 89',
    subject: teacherData.subjects,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTeacher({
      ...teacher,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    
    // Simulate API call to update profile
    setTimeout(() => {
      setFormSuccess('Profil mis à jour avec succès');
      setIsEditing(false);
      
      setTimeout(() => {
        setFormSuccess('');
      }, 3000);
    }, 1000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validation
    if (passwordData.currentPassword !== 'password') {
      setFormError('Mot de passe actuel incorrect');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setFormError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return;
    }
    
    // Simulate API call to update password
    setTimeout(() => {
      setFormSuccess('Mot de passe mis à jour avec succès');
      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      setTimeout(() => {
        setFormSuccess('');
      }, 3000);
    }, 1000);
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
              <span className="text-gray-800">Mon profil</span>
            </div>
          </div>
          
          {formSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
            >
              <p>{formSuccess}</p>
            </motion.div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-1"
            >
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
                    <img 
                      src="/image1.jpeg"
                      alt={teacher.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{teacher.name}</h2>
                  <p className="text-gray-600 mb-4">{teacher.subject}</p>
                  
                  <div className="w-full space-y-3 mt-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-900">{teacher.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="text-gray-900">{teacher.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3 w-full">
                    <button
                      onClick={() => {
                        setIsEditing(!isEditing);
                        setShowPasswordForm(false);
                      }}
                      className="block w-full py-2 px-4 text-center bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors"
                    >
                      {isEditing ? 'Annuler' : 'Modifier mon profil'}
                    </button>
                    <button
                      onClick={() => {
                        setShowPasswordForm(!showPasswordForm);
                        setIsEditing(false);
                      }}
                      className="block w-full py-2 px-4 text-center bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      {showPasswordForm ? 'Annuler' : 'Changer mon mot de passe'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Edit Profile Form */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              {isEditing ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="h-5 w-5 mr-2 text-lime-600" />
                    Modifier mon profil
                  </h3>
                  
                  <form onSubmit={handleProfileUpdate}>
                    <div className="grid grid-cols-1 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={teacher.name}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={teacher.email}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={teacher.phone}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Matière enseignée
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={teacher.subject}
                          onChange={handleInputChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors"
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </form>
                </div>
              ) : showPasswordForm ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Key className="h-5 w-5 mr-2 text-lime-600" />
                    Changer mon mot de passe
                  </h3>
                  
                  {formError && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
                      <p>{formError}</p>
                    </div>
                  )}
                  
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="grid grid-cols-1 gap-6 mb-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Mot de passe actuel
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirmer le nouveau mot de passe
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowPasswordForm(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors"
                      >
                        Mettre à jour le mot de passe
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <User className="h-5 w-5 mr-2 text-lime-600" />
                    Informations personnelles
                  </h3>
                  
                  <p className="text-gray-600 mb-2"><strong>Email :</strong> {teacher.email}</p>
                  <p className="text-gray-600 mb-2"><strong>Téléphone :</strong> {teacher.phone}</p>
                  <p className="text-gray-600 mb-2"><strong>Matière enseignée :</strong> {teacher.subject}</p>
                  
                  <div className="flex justify-end space-x-4 mt-6">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 transition-colors"
                    >
                      Modifier
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeacherProfile;
