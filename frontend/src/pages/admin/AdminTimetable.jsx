import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { Calendar, Download, HomeIcon, Settings, RefreshCw, Check } from 'lucide-react';
import { classLevels, classes, getClassTimetable, teachers, rooms } from '../../utils/timetableData';

const AdminTimetable = () => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredClasses, setFilteredClasses] = useState(classes);
  const [timetableData, setTimetableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Filters classes based on selected level
  const handleLevelChange = (e) => {
    const level = e.target.value;
    setSelectedLevel(level);
    
    if (level) {
      setFilteredClasses(classes.filter(cls => cls.levelId === level));
    } else {
      setFilteredClasses([]);
    }
    
    setSelectedClass('');
    setTimetableData([]);
  };
  
  // Loads timetable data for selected class
  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    
    if (classId) {
      setIsLoading(true);
      setTimeout(() => {
        const data = getClassTimetable(classId);
        setTimetableData(data);
        setIsLoading(false);
      }, 500);
    } else {
      setTimetableData([]);
    }
  };
  
  // Simulates automatic timetable generation
  const handleGenerateTimetable = () => {
    setIsGenerating(true);
    
    // Simulate generation process
    setTimeout(() => {
      setIsGenerating(false);
      setShowSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };
  
  // Gets teacher name by ID
  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Non assigné';
  };
  
  // Gets room name by ID
  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Non assignée';
  };
  
  // Exports timetable as PDF
  const exportToPDF = () => {
    if (!selectedClass) return;
    
    const classObj = classes.find(c => c.id === selectedClass);
    const className = classObj ? classObj.name : 'Classe';
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Emploi du temps - ${className}`, 105, 15, { align: 'center' });
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 105, 22, { align: 'center' });
    
    // Add table
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    const timeSlots = ['08:30-10:00', '10:15-11:45', '13:30-15:00', '15:15-16:45'];
    
    let startY = 30;
    
    // Header row
    doc.setFillColor(240, 240, 240);
    doc.rect(10, startY, 190, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Horaire', 20, startY + 6);
    
    days.forEach((day, index) => {
      doc.text(day, 50 + (index * 30), startY + 6);
    });
    
    startY += 15;
    doc.setFont('helvetica', 'normal');
    
    // Data rows
    timeSlots.forEach((timeSlot, rowIndex) => {
      const [start, end] = timeSlot.split('-');
      
      // Row background
      if (rowIndex % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(10, startY - 5, 190, 20, 'F');
      }
      
      doc.text(`${start}-${end}`, 20, startY);
      
      days.forEach((day, dayIndex) => {
        const entry = timetableData.find(e => 
          e.day === day && e.startTime === start && e.endTime === end
        );
        
        if (entry) {
          const teacher = getTeacherName(entry.teacherId);
          const subject = entry.subject;
          doc.text(subject, 50 + (dayIndex * 30), startY);
          doc.text(teacher, 50 + (dayIndex * 30), startY + 5, { fontSize: 8 });
        }
      });
      
      startY += 20;
    });
    
    // Save PDF
    doc.save(`emploi-du-temps-${className}.pdf`);
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
              <span className="text-gray-800">Gestion des emplois du temps</span>
            </div>
            
            <button
              onClick={handleGenerateTimetable}
              disabled={isGenerating}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Settings className="h-4 w-4 mr-2" />
                  Génération automatique
                </>
              )}
            </button>
          </div>
          
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-100 border-l-4 border-green-500 p-4 flex items-center"
            >
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700">Les emplois du temps ont été générés avec succès pour toutes les classes.</p>
            </motion.div>
          )}
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-blue-600" />
              Gestion des emplois du temps
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau
                </label>
                <select
                  id="level"
                  value={selectedLevel}
                  onChange={handleLevelChange}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionner un niveau</option>
                  {classLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-1">
                  Classe
                </label>
                <select
                  id="class"
                  value={selectedClass}
                  onChange={handleClassChange}
                  disabled={!selectedLevel}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Sélectionner une classe</option>
                  {filteredClasses.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={exportToPDF}
                  disabled={!selectedClass || isLoading}
                  className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none disabled:bg-green-300 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter en PDF
                </button>
              </div>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : timetableData.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-3 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-700">
                        Horaire
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-center text-sm font-medium text-gray-700">
                        Lundi
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-center text-sm font-medium text-gray-700">
                        Mardi
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-center text-sm font-medium text-gray-700">
                        Mercredi
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-center text-sm font-medium text-gray-700">
                        Jeudi
                      </th>
                      <th className="py-3 px-4 border-b border-gray-200 text-center text-sm font-medium text-gray-700">
                        Vendredi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {['08:30-10:00', '10:15-11:45', '13:30-15:00', '15:15-16:45'].map((timeSlot) => (
                      <tr key={timeSlot}>
                        <td className="py-3 px-4 border-b text-sm text-gray-700">{timeSlot}</td>
                        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((day) => (
                          <td key={day} className="py-3 px-4 border-b text-center text-sm text-gray-700">
                            {timetableData.find(
                              (entry) => entry.day === day && entry.startTime === timeSlot.split('-')[0] && entry.endTime === timeSlot.split('-')[1]
                            ) ? (
                              <>
                                <div>{timetableData.find(entry => entry.day === day).subject}</div>
                                <div className="text-xs text-gray-500">{getTeacherName(timetableData.find(entry => entry.day === day).teacherId)}</div>
                              </>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-20">Aucune donnée disponible pour cette classe.</div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminTimetable;
