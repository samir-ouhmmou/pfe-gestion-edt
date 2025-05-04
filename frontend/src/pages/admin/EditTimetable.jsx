import { useState, useEffect } from 'react';
import { Calendar, HomeIcon, Save, X, Check, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../../Components/common/Header';
import Footer from '../../Components/common/Footer';
import { classLevels, classes, teachers, rooms } from '../../utils/timetableData';
import axios from 'axios';

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
const timeSlots = ['08:30-10:00', '10:15-11:45', '13:30-15:00', '15:15-16:45'];

const EditTimetable = () => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleLevelChange = (e) => {
    const levelId = e.target.value;
    setSelectedLevel(levelId);
    setFilteredClasses(classes.filter((cls) => cls.levelId === levelId));
    setSelectedClass('');
    setTimetable({});
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    setTimetable({});
  };

  // Charger l'emploi du temps existant
  useEffect(() => {
    if (selectedClass) {
      axios
        .get(`http://localhost:8888/api/timetable/${selectedClass}`)
        .then((res) => {
          const parsed = {};
          res.data.forEach((entry) => {
            if (!parsed[entry.day]) parsed[entry.day] = {};
            parsed[entry.day][entry.time] = {
              subject: entry.subject,
              teacherId: entry.teacherId,
              roomId: entry.roomId
            };
          });
          setTimetable(parsed);
        })
        .catch((err) => {
          console.error('Erreur de chargement :', err);
        });
    }
  }, [selectedClass]);

  const handleCellChange = (day, slot, field, value) => {
    setTimetable((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot]: {
          ...prev[day]?.[slot],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = () => {
    if (!selectedClass) return;

    const entries = [];
    days.forEach((day) => {
      timeSlots.forEach((slot) => {
        const data = timetable[day]?.[slot];
        if (data && data.subject && data.teacherId && data.roomId) {
          entries.push({
            classId: selectedClass,
            day,
            time: slot,
            subject: data.subject,
            teacherId: data.teacherId,
            roomId: data.roomId,
          });
        }
      });
    });

    axios
      .post('http://localhost:5000/api/timetable/save', entries)
      .then(() => {
        setShowSuccess(true);
        setShowError(false);
        setTimeout(() => setShowSuccess(false), 4000);
      })
      .catch(() => {
        setShowError(true);
        setShowSuccess(false);
        setTimeout(() => setShowError(false), 4000);
      });
  };

  const exportToPDF = () => {
    if (!selectedClass) return;

    const classObj = classes.find((c) => c.id === selectedClass);
    const className = classObj ? classObj.name : 'Classe';

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Emploi du temps - ${className}`, 105, 15, { align: 'center' });

    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 105, 22, { align: 'center' });

    let startY = 30;
    doc.setFillColor(240, 240, 240);
    doc.rect(10, startY, 190, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('Horaire', 15, startY + 6);

    days.forEach((day, i) => {
      doc.text(day, 45 + i * 30, startY + 6);
    });

    startY += 15;
    doc.setFont('helvetica', 'normal');

    timeSlots.forEach((timeSlot, rowIdx) => {
      if (rowIdx % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(10, startY - 5, 190, 20, 'F');
      }

      doc.text(timeSlot, 15, startY);
      days.forEach((day, colIdx) => {
        const cell = timetable[day]?.[timeSlot];
        if (cell) {
          const teacher = teachers.find((t) => t.id === cell.teacherId)?.name || '';
          const subject = cell.subject || '';
          doc.text(`${subject}`, 45 + colIdx * 30, startY);
          doc.setFontSize(8);
          doc.text(`${teacher}`, 45 + colIdx * 30, startY + 5);
          doc.setFontSize(10);
        }
      });

      startY += 20;
    });

    doc.save(`emploi-du-temps-${className}.pdf`);
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
              <span className="text-gray-800">Modifier emploi du temps</span>
            </div>

            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-lime-500 text-white rounded-md hover:bg-lime-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Enregistrer
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-lime-600" />
              Modifier manuellement l’emploi du temps
            </h2>

            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 bg-green-100 border-l-4 border-green-500 p-4 flex items-center rounded"
                >
                  <Check className="h-5 w-5 text-green-600 mr-2" />
                  <p className="text-green-700">L'emploi du temps a été enregistré avec succès.</p>
                </motion.div>
              )}
              {showError && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 bg-red-100 border-l-4 border-red-500 p-4 flex items-center rounded"
                >
                  <X className="h-5 w-5 text-red-600 mr-2" />
                  <p className="text-red-700">Erreur lors de l'enregistrement. Veuillez réessayer.</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                <select
                  value={selectedLevel}
                  onChange={handleLevelChange}
                  className="w-full px-4 py-2 border rounded-md"
                >
                  <option value="">Sélectionner un niveau</option>
                  {classLevels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Classe</label>
                <select
                  value={selectedClass}
                  onChange={handleClassChange}
                  disabled={!selectedLevel}
                  className="w-full px-4 py-2 border rounded-md disabled:bg-gray-100"
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
                  disabled={!selectedClass}
                  className="w-full px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 flex items-center justify-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exporter en PDF
                </button>
              </div>
            </div>

            {selectedClass && (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Horaire</th>
                      {days.map((day) => (
                        <th key={day} className="p-2 border text-center">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((timeSlot) => (
                      <tr key={timeSlot}>
                        <td className="p-2 border font-medium">{timeSlot}</td>
                        {days.map((day) => (
                          <td key={`${day}-${timeSlot}`} className="p-2 border space-y-1">
                            <input
                              type="text"
                              placeholder="Matière"
                              className="w-full border rounded px-2 py-1"
                              value={timetable[day]?.[timeSlot]?.subject || ''}
                              onChange={(e) =>
                                handleCellChange(day, timeSlot, 'subject', e.target.value)
                              }
                            />
                            <select
                              className="w-full border rounded px-2 py-1"
                              value={timetable[day]?.[timeSlot]?.teacherId || ''}
                              onChange={(e) =>
                                handleCellChange(day, timeSlot, 'teacherId', e.target.value)
                              }
                            >
                              <option value="">Professeur</option>
                              {teachers.map((t) => (
                                <option key={t.id} value={t.id}>
                                  {t.name}
                                </option>
                              ))}
                            </select>
                            <select
                              className="w-full border rounded px-2 py-1"
                              value={timetable[day]?.[timeSlot]?.roomId || ''}
                              onChange={(e) =>
                                handleCellChange(day, timeSlot, 'roomId', e.target.value)
                              }
                            >
                              <option value="">Salle</option>
                              {rooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                  {r.name}
                                </option>
                              ))}
                            </select>
                          </td>
                        ))}
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

export default EditTimetable;
