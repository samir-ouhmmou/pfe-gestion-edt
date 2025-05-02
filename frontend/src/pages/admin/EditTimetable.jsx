import { useState, useEffect } from 'react';
import { Calendar, HomeIcon, Save, X, Check} from 'lucide-react';
import { Link } from 'react-router-dom';
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

  // 🔁 Charger l'emploi du temps existant
  useEffect(() => {
    if (selectedClass) {
      axios.get(`http://localhost:8888/api/timetable/${selectedClass}`)
        .then((res) => {
          const timetableData = res.data;
          const parsed = {};

          timetableData.forEach(entry => {
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
          console.error("Erreur de chargement :", err);
        });
      const existingTimetable = getTimetableForClass(selectedClass); // à adapter
       setTimetable(existingTimetable); // remplir le tableau
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

  // 💾 Enregistrement (modification)
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
            roomId: data.roomId
          });
        }
      });
    });
  
    axios.post('http://localhost:5000/api/timetable/save', entries)
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
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
            </div>

            {selectedClass && (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Horaire</th>
                      {days.map((day) => (
                        <th key={day} className="p-2 border text-center">{day}</th>
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
                              onChange={(e) => handleCellChange(day, timeSlot, 'subject', e.target.value)}
                            />
                            <select
                              className="w-full border rounded px-2 py-1"
                              value={timetable[day]?.[timeSlot]?.teacherId || ''}
                              onChange={(e) => handleCellChange(day, timeSlot, 'teacherId', e.target.value)}
                            >
                              <option value="">Professeur</option>
                              {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                              ))}
                            </select>
                            <select
                              className="w-full border rounded px-2 py-1"
                              value={timetable[day]?.[timeSlot]?.roomId || ''}
                              onChange={(e) => handleCellChange(day, timeSlot, 'roomId', e.target.value)}
                            >
                              <option value="">Salle</option>
                              {rooms.map((room) => (
                                <option key={room.id} value={room.id}>{room.name}</option>
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
