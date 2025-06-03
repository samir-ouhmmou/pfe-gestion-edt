// Mock data for class levels
const classLevels = [
  { id: '1P', name: '1P' },
  { id: '2P', name: '2P' },
  { id: '3P', name: '3P' },
  { id: '4P', name: '4P' },
  { id: '5P', name: '5P' },
  { id: '6P', name: '6P' },
];

const availableLevels = ['1P', '2P', '3P', '4P', '5P', '6P'];

// Mock data for classes
const classes = [
  { id: '26', name: '1P A', levelId: '1P' },
  { id: '27', name: '1P B', levelId: '1P' },
  { id: '28', name: '2P A', levelId: '2P' },
  { id: '29', name: '2P B', levelId: '2P' },
  { id: '30', name: '3P A', levelId: '3P' },
  { id: '31', name: '3P B', levelId: '3P' },
  { id: '32', name: '4P A', levelId: '4P' },
  { id: '33', name: '4P B', levelId: '4P' },
  { id: '34', name: '5P A', levelId: '5P' },
  { id: '35', name: '5P B', levelId: '5P' },
  { id: '36', name: '6P A', levelId: '6P' },
  { id: '37', name: '6P B', levelId: '6P' },
];

// les cours possible
const availableSubjects = [
  'Français',
  'Mathématiques',
  'Sciences',
  'Histoire-Géographie',
  'Anglais',
  'Sport',
  'Education Islamique',
  'Arabe',
  'Informatique',
  'Education Artistique'
];

const teachers = [
  { 
    id: 't1', 
    name: 'MACHKOUR Mustapha', 
    email: 'Machkour@ecole.com', 
    subjects: ['Mathématiques'],
    image: '/image1.jpeg'
  },
  { 
    id: 't2', 
    name: 'BATTOU amal', 
    email: 'Battou@ecole.com', 
    subjects: ['Anglais'],
    image: '/image1.jpeg'
  },
  { 
    id: 't3', 
    name: 'CHAKIR Brahim', 
    email: 'Chakir@ecole.com', 
    subjects: ['Sport'],
    image: '/image1.jpeg'
  },
  { 
    id: 't4', 
    name: 'AABOUZ Imane', 
    email: 'Aabouz@ecole.com', 
    subjects: ['Arabe'],
    image: '/image1.jpeg'
  },
  { 
    id: 't5', 
    name: 'EL-MOUBARAKI Hicham', 
    email: 'Hicham123@ecole.com', 
    subjects: ['Education Islamique'],
    image: '/image1.jpeg'
  },
  { 
    id: 't6', 
    name: 'OUHMMOU Samir', 
    email: 'Ouhmmou@ecole.com', 
    subjects: ['Informatique'],
    image: '/image1.jpeg'
  },
  { 
    id: 't7', 
    name: 'BOUAABANE Youssef', 
    email: 'Youssef@ecole.com', 
    subjects: ['Histoire-Géographie'],
    image: '/image1.jpeg'
  },
  { 
    id: 't8', 
    name: 'OUHMMOU Taoufik', 
    email: 'Taoufik123@ecole.com', 
    subjects: ['Français'],
    image: '/image1.jpeg'
  },
  { 
    id: 't9', 
    name: 'GOUIJANE Ayoub', 
    email: 'gouijane123@ecole.com', 
    subjects: ['Education Artistique'],
    image: '/image1.jpeg'
  },
  { 
    id: 't10', 
    name: 'BOULOUZ Abdellah', 
    email: 'Boulouz123@ecole.com', 
    subjects: ['Sciences'],
    image: '/image1.jpeg'
  },
];

// Mock data for rooms
const rooms = [
  { id: '1', name: 'Salle 1', capacity: 30 },
  { id: '2', name: 'Salle 2', capacity: 30 },
  { id: '3', name: 'Salle 3', capacity: 30 },
  { id: '4', name: 'Salle 4', capacity: 30 },
  { id: '5', name: 'Salle 5', capacity: 30 },
  { id: '6', name: 'Salle 6', capacity: 30 },
  { id: '7', name: 'Salle 7', capacity: 30 },
  { id: '8', name: 'Sport', capacity: 60 },
  { id: '10', name: 'Salle Informatique', capacity: 25 },
  { id: '11', name: 'Bibliothèque', capacity: 45 },
];

// fonction pour générer une emploi du temps 
const generateTimetableEntries = (classId) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeslots = [
    { start: '08:30', end: '10:25' },
    { start: '10:35', end: '12:30' },
    { start: '14:30', end: '16:25' },
    { start: '16:35', end: '18:30' }
  ];

  // Créer un cache local pour suivre les affectations
  const assignments = {
    teachers: new Map(),
    rooms: new Map()
  };

  return days.flatMap(day => {
    const dayTimeslots = day === 'Mercredi' ? timeslots.slice(0, 2) : timeslots;
    let lastSubject = null;

    return dayTimeslots.map(timeslot => {
      const timeKey = `${day}-${timeslot.start}`;
      
      // 1. Filtrer les matières disponibles (éviter les répétitions successives)
      let availableSubjectsFiltered = [...availableSubjects];
      if (lastSubject) {
        availableSubjectsFiltered = availableSubjectsFiltered.filter(subj => subj !== lastSubject);
      }

      // 2. Trouver une combinaison valide (matière + prof + salle)
      let selectedSubject, selectedTeacher, selectedRoom;
      
      // Mélanger les matières pour varier les choix
      const shuffledSubjects = [...availableSubjectsFiltered].sort(() => Math.random() - 0.5);
      
      for (const subject of shuffledSubjects) {
        // Trouver les profs disponibles pour cette matière
        const suitableTeachers = teachers.filter(t => 
          t.subjects.includes(subject) && 
          !assignments.teachers.has(`${timeKey}-${t.id}`)
        );

        if (suitableTeachers.length > 0) {
          // Trouver une salle disponible
          let room;
          if (subject === 'Sport') {
            room = rooms.find(r => 
              r.name === 'Sport' && 
              !assignments.rooms.has(`${timeKey}-${r.id}`)
            );
          } else if (subject === 'Informatique') {
            room = rooms.find(r => 
              r.name === 'Salle Informatique' && 
              !assignments.rooms.has(`${timeKey}-${r.id}`)
            );
          } else {
            room = rooms.find(r => 
              !['Sport', 'Salle Informatique'].includes(r.name) &&
              !assignments.rooms.has(`${timeKey}-${r.id}`)
            );
          }

          if (room) {
            selectedSubject = subject;
            selectedTeacher = suitableTeachers[Math.floor(Math.random() * suitableTeachers.length)];
            selectedRoom = room;
            break;
          }
        }
      }

      // 3. Si aucune combinaison trouvée, créer un créneau vide
      if (!selectedSubject) {
        return {
          id: `${day}-${timeslot.start}-${classId}`,
          day,
          startTime: timeslot.start,
          endTime: timeslot.end,
          subject: '-',
          teacherId: null,
          roomId: null,
          classId
        };
      }

      // 4. Enregistrer les affectations
      lastSubject = selectedSubject;
      assignments.teachers.set(`${timeKey}-${selectedTeacher.id}`, true);
      assignments.rooms.set(`${timeKey}-${selectedRoom.id}`, true);

      return {
        id: `${day}-${timeslot.start}-${classId}`,
        day,
        startTime: timeslot.start,
        endTime: timeslot.end,
        subject: selectedSubject,
        teacherId: selectedTeacher.id,
        roomId: selectedRoom.id,
        classId
      };
    });
  });
};

const getTeacherTimetable = (teacherId) => {
  let allEntries = [];

  // Generate timetable for all classes
  classes.forEach(cls => {
    const classEntries = generateTimetableEntries(cls.id);
    allEntries = [...allEntries, ...classEntries];
  });
  
  // Filter for the specific teacher
  return allEntries.filter(entry => entry.teacherId === teacherId);
};

// emploi du temps pour un classe spécifier
const getClassTimetable = (classId) => {
  return generateTimetableEntries(classId);
};

// edt pour spéfic salle
const getRoomTimetable = (roomId) => {
  let allEntries = [];

  // générer edt pour tous les classes
  classes.forEach(cls => {
    const classEntries = generateTimetableEntries(cls.id);
    allEntries = [...allEntries, ...classEntries];
  });

  // filtrer pour une salle spécifier
  return allEntries.filter(entry => entry.roomId === roomId);
};

export {
  classLevels,
  classes,
  availableSubjects,
  teachers,
  rooms,
  availableLevels,
  getClassTimetable,
  getRoomTimetable,
  getTeacherTimetable
};