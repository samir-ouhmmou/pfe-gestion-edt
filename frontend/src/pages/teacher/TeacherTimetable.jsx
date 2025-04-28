import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { useAuth } from '../../context/AuthContext';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { teachers, getTeacherTimetable, rooms, classes } from '../../utils/timetableData';
import { Calendar, Download, HomeIcon } from 'lucide-react';

const TeacherTimetable = () => {
  const { user } = useAuth();
  const teacher = teachers.find(t => t.email === user?.email) || teachers[0];
  const [timetableData] = useState(getTeacherTimetable(teacher.id));

  // Helper function to get room name
  const getRoomName = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Salle non assignée';
  };

  // Helper function to get class name
  const getClassName = (classId) => {
    const classObj = classes.find(c => c.id === classId);
    return classObj ? classObj.name : 'Classe non trouvée';
  };

  // Function to generate PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text(`Emploi du temps - ${teacher.name}`, 105, 15, { align: 'center' });
    
    // Add current date
    const today = new Date();
    doc.setFontSize(10);
    doc.text(`Généré le: ${today.toLocaleDateString('fr-FR')}`, 105, 22, { align: 'center' });
    
    // Add table headers
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
    let startY = 30;
    let startX = 20;
    
    // Draw days row
    doc.setFillColor(235, 235, 235);
    doc.rect(startX, startY, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Horaire', startX + 20, startY + 6, { align: 'center' });
    
    for (let i = 0; i < days.length; i++) {
      doc.text(days[i], startX + 55 + (i * 30), startY + 6, { align: 'center' });
    }
    
    // Group by time slots
    const timeSlots = Array.from(new Set(timetableData.map(entry => `${entry.startTime}-${entry.endTime}`)));
    timeSlots.sort((a, b) => {
      const aStart = a.split('-')[0];
      const bStart = b.split('-')[0];
      return aStart.localeCompare(bStart);
    });
    
    startY += 15;
    doc.setFont('helvetica', 'normal');
    
    // Draw time slots and classes
    timeSlots.forEach((timeSlot, index) => {
      const [startTime, endTime] = timeSlot.split('-');
      const timeLabel = `${startTime} - ${endTime}`;
      
      // Alternate row colors
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
          const className = getClassName(entry.classId);
          const room = getRoomName(entry.roomId);
          const text = `${entry.subject}\n${className}\n${room}`;
          
          // Split text into lines to fit in cell
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
    
    // Save PDF
    doc.save(`emploi-du-temps-${teacher.name.replace(' ', '-')}.pdf`);
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
              <span className="text-gray-800">Mon emploi du temps</span>
            </div>
            
            <button
              onClick={generatePDF}
              className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter en PDF
            </button>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-blue-600" />
              Mon emploi du temps
            </h1>
            
            {timetableData.length > 0 ? (
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
                    {['08:30-10:00', '10:15-11:45', '13:30-15:00', '15:15-16:45'].map((timeSlot, index) => {
                      const [startTime, endTime] = timeSlot.split('-');
                      return (
                        <tr key={timeSlot} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-3 px-4 border-b border-gray-200 text-sm text-gray-700">
                            {startTime} - {endTime}
                          </td>
                          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'].map((day) => {
                            const entry = timetableData.find(
                              (e) => e.day === day && e.startTime === startTime && e.endTime === endTime
                            );
                            
                            // Wednesday afternoon is empty in French elementary schools
                            if (day === 'Mercredi' && (timeSlot === '13:30-15:00' || timeSlot === '15:15-16:45')) {
                              return (
                                <td key={`${day}-${timeSlot}`} className="py-3 px-4 border-b border-gray-200 text-center text-sm text-gray-400 bg-gray-100">
                                  -
                                </td>
                              );
                            }
                            
                            return (
                              <td key={`${day}-${timeSlot}`} className="py-3 px-4 border-b border-gray-200 text-center text-sm">
                                {entry ? (
                                  <div>
                                    <p className="font-medium text-gray-800">{entry.subject}</p>
                                    <p className="text-gray-600">{getClassName(entry.classId)}</p>
                                    <p className="text-gray-500">{getRoomName(entry.roomId)}</p>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Aucun cours n'est programmé pour le moment.</p>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TeacherTimetable;
