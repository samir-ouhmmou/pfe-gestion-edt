import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import Header from '../Components/common/Header';
import Footer from '../Components/common/Footer';
import { classLevels, classes, getClassTimetable, teachers, rooms } from '../utils/timetableData';
import { Calendar, Download, Search } from 'lucide-react';

const TimetablePage = () => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredClasses, setFilteredClasses] = useState(classes);
  const [timetableData, setTimetableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedLevel) {
      setFilteredClasses(classes.filter(cls => cls.levelId === selectedLevel));
      setSelectedClass('');
    } else {
      setFilteredClasses([]);
      setSelectedClass('');
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedClass) {
      setIsLoading(true);
      setTimeout(() => {
        const data = getClassTimetable(selectedClass);
        setTimetableData(data);
        setIsLoading(false);
      }, 800);
    } else {
      setTimetableData([]);
    }
  }, [selectedClass]);

  const getTeacherName = (teacherId) => {
    const teacher = teachers.find(t => t.id === teacherId);
    return teacher ? teacher.name : 'Enseignant non assigné';
  };

  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Salle non assignée';
  };

  const getClassName = (classId) => {
    const classObj = classes.find(c => c.id === classId);
    return classObj ? classObj.name : 'Classe non trouvée';
  };

  const generatePDF = () => {
    if (!selectedClass) return;
    
    const className = getClassName(selectedClass);
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text(`Emploi du temps - ${className}`, 105, 15, { align: 'center' });
    
    const today = new Date();
    doc.setFontSize(10);
    doc.text(`Généré le: ${today.toLocaleDateString('fr-FR')}`, 105, 22, { align: 'center' });
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    let startY = 30;
    let startX = 20;
    
    doc.setFillColor(235, 235, 235);
    doc.rect(startX, startY, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Horaire', startX + 20, startY + 6, { align: 'center' });
    
    for (let i = 0; i < days.length; i++) {
      doc.text(days[i], startX + 55 + (i * 30), startY + 6, { align: 'center' });
    }
    
    const timeSlots = Array.from(new Set(timetableData.map(entry => `${entry.startTime}-${entry.endTime}`)));
    timeSlots.sort((a, b) => {
      const aStart = a.split('-')[0];
      const bStart = b.split('-')[0];
      return aStart.localeCompare(bStart);
    });
    
    startY += 15;
    doc.setFont('helvetica', 'normal');
    
    timeSlots.forEach((timeSlot, index) => {
      const [startTime, endTime] = timeSlot.split('-');
      const timeLabel = `${startTime} - ${endTime}`;
      
      if (index % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(startX, startY, 170, 15, 'F');
      }
      
      doc.text(timeLabel, startX + 20, startY + 8, { align: 'center' });
      
      days.forEach((day, dayIndex) => {
        const entry = timetableData.find(e => 
          e.day === day && e.startTime === startTime && e.endTime === endTime
        );
        
        if (entry) {
          const teacher = getTeacherName(entry.teacherId);
          const room = getRoomName(entry.roomId);
          const text = `${entry.subject}\n${teacher}\n${room}`;
          
          const lines = text.split('\n');
          lines.forEach((line, lineIndex) => {
            doc.text(line, startX + 55 + (dayIndex * 30), startY + 4 + (lineIndex * 4), { align: 'center' });
          });
        } else {
          doc.text('-', startX + 55 + (dayIndex * 30), startY + 8, { align: 'center' });
        }
      });
      
      startY += 15;
    });
    
    doc.save(`emploi-du-temps-${className}.pdf`);
  };

  const handleViewTimetable = () => {
    if (selectedClass) {
      setIsLoading(true);
      setTimeout(() => {
        const data = getClassTimetable(selectedClass);
        setTimetableData(data);
        setIsLoading(false);
      }, 800);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        <section className="py-12 bg-blue-800 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold mb-4">Consultation des Emplois du Temps</h1>
              <p className="text-xl text-blue-100">
                Consultez l'emploi du temps de n'importe quelle classe en quelques clics.
              </p>
            </motion.div>
          </div>
        </section>
        
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau
                  </label>
                  <select
                    id="level"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
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
                    onChange={(e) => setSelectedClass(e.target.value)}
                    disabled={!selectedLevel}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                    onClick={handleViewTimetable}
                    disabled={!selectedClass || isLoading}
                    className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Search className="h-5 w-5 mr-2" />
                    )}
                    Consulter
                  </button>
                </div>
              </div>

              {timetableData.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Emploi du temps - {getClassName(selectedClass)}
                    </h2>
                    <button
                      onClick={generatePDF}
                      className="flex items-center px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Exporter en PDF
                    </button>
                  </div>

                  {/* TABLE */}
                  {/* (le reste du code continue pareil avec ta table, etc.) */}
                </motion.div>
              )}

              {/* ... (tes autres messages quand pas de classe sélectionnée, etc.) */}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TimetablePage;
