// Mock data for class levels
const classLevels = [
  { id: 'cp', name: 'CP' },
  { id: 'ce1', name: 'CE1' },
  { id: 'ce2', name: 'CE2' },
  { id: 'cm1', name: 'CM1' },
  { id: 'cm2', name: 'CM2' },
  { id: 'cm3', name: 'CM3' },
];
const availableLevels = [
  'CP','CE1','CE2','CM1','CM2','CM3',
  
];

// Mock data for classes
const classes = [
  { id: 'cp-a', name: 'CP A', levelId: 'cp' },
  { id: 'cp-b', name: 'CP B', levelId: 'cp' },
  { id: 'ce1-a', name: 'CE1 A', levelId: 'ce1' },
  { id: 'ce1-b', name: 'CE1 B', levelId: 'ce1' },
  { id: 'ce2-a', name: 'CE2 A', levelId: 'ce2' },
  { id: 'ce2-b', name: 'CE2 B', levelId: 'ce2' },
  { id: 'cm1-a', name: 'CM1 A', levelId: 'cm1' },
  { id: 'cm1-b', name: 'CM1 B', levelId: 'cm1' },
  { id: 'cm2-a', name: 'CM2 A', levelId: 'cm2' },
  { id: 'cm2-b', name: 'CM2 B', levelId: 'cm2' },
  { id: 'cm3-a', name: 'CM3 A', levelId: 'cm3' },
  { id: 'cm3-b', name: 'CM3 B', levelId: 'cm3' },
];

// les cours possible
const availableSubjects = [
  'Français',
  'Mathématiques',
  'Sciences',
  'Histoire-Géographie',
  'Anglais',
  'Sport',
  'Islamique',
  'Arabe',
  'Informatique',
];
// Mock data for teachers with multiple subjects
const teachers = [
  { 
    id: 't3', 
    name: 'Machkour mustapha', 
    email: 'Machkour@school.com', 
    subjects: ['Sciences', 'Mathématiques'],
    image: '/image1.jpeg'
  },
   
  { 
    id: 't5', 
    name: 'Amellal Youssef', 
    email: 'YoussefAmellal@school.com', 
    subjects: ['Anglais', 'Français'],
    image: '/image1.jpeg'
  },
  { 
    id: 't6', 
    name: 'Brahim chakir', 
    email: 'chakirbrahim@school.com', 
    subjects: ['Sport', 'Sciences'],
    image: '/image1.jpeg'
  },
  
];

// Mock data for rooms
const rooms = [
  { id: '1', name: 'salle 1', capacity: 30},
  { id: '2', name: 'salle 2', capacity: 30},
  { id: '3', name: 'salle 3', capacity: 30},
  { id: '4', name: 'salle 4', capacity: 30},
  { id: '5', name: 'salle 5', capacity: 30},
  { id: '6', name: 'salle 6', capacity: 30},
  { id: '7', name: 'salle 7', capacity: 30},
  { id: '8', name: 'salle 8', capacity: 30},
  { id: '9', name: 'Salle 9', capacity: 30},
  { id: '10', name: 'Salle 10', capacity: 60},
  { id: '11', name: 'Sport', capacity: 100},
  { id: '12', name: 'Salle  Informatique', capacity: 30},
  { id: '13', name: 'Bibliothèque', capacity: 100},
];

// Function to generate timetable entries
const generateTimetableEntries = (classId) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeslots = [
      { start: '08:00', end: '10:00' },
      { start: '10:30', end: '12:30' },
      { start: '14:00', end: '16:00' },
      { start: '16:30', end: '17:30' },
  ];
  
  const entries = [];
  
  days.forEach(day => {
    // Wednesday only has morning classes in French elementary schools
    const dayTimeslots = day === 'Mercredi' ? timeslots.slice(0, 2) : timeslots;
    
    dayTimeslots.forEach((timeslot) => {
      // Get a random subject
      const subject = availableSubjects[Math.floor(Math.random() * availableSubjects.length)];
      
      // Find teachers who teach this subject
      const suitableTeachers = teachers.filter(t => t.subjects.includes(subject));
      const teacher = suitableTeachers.length > 0 
        ? suitableTeachers[Math.floor(Math.random() * suitableTeachers.length)] 
        : teachers[Math.floor(Math.random() * teachers.length)];
      
      // Get a random room, but use specific rooms for specific subjects
      let room;
      if (subject === 'Sport') {
        room = rooms.find(r => r.name === 'Gymnase') || rooms[Math.floor(Math.random() * rooms.length)];
      } else if (subject === 'Arts Plastiques') {
        room = rooms.find(r => r.name === 'Salle d\'Arts') || rooms[Math.floor(Math.random() * rooms.length)];
      } else if (subject === 'Informatique') {
        room = rooms.find(r => r.name === 'Salle de Informatique')|| rooms[Math.floor(Math.random() * rooms.length)];
      } else {
        // For other subjects, use a standard classroom
        const standardRooms = rooms.filter(r => !['Gymnase', 'Salle d\'Arts', 'Salle de Informatique', 'Bibliothèque'].includes(r.name));
        room = standardRooms[Math.floor(Math.random() * standardRooms.length)];
      }
      
      entries.push({
        id: `${day}-${timeslot.start}-${classId}`,
        day,
        startTime: timeslot.start,
        endTime: timeslot.end,
        subject,
        teacherId: teacher.id,
        classId,
        roomId: room.id,
      });
    });
  });
  
  return entries;
};

// Get a specific teacher's timetable
const getTeacherTimetable = (teacherId) => {
  let allEntries = [];
  
  // Generate timetable for all classes
  classes.forEach(cls => {
    const classEntries = generateTimetableEntries(cls.id);
    allEntries = [...allEntries, ...classEntries];
  });
  
  // Filter entries for the specific teacher
  return allEntries.filter(entry => entry.teacherId === teacherId);
};

// Get a timetable for a specific class
const getClassTimetable = (classId) => {
  return generateTimetableEntries(classId);
};

// Get all timetable entries for admin view
const getAllTimetableEntries = () => {
  let allEntries = [];
  
  classes.forEach(cls => {
    const classEntries = generateTimetableEntries(cls.id);
    allEntries = [...allEntries, ...classEntries];
  });
  
  return allEntries;
};
// Get a timetable for a specific room
const getRoomTimetable = (roomId) => {
let allEntries = [];

// Generate timetable for all classes
classes.forEach(cls => {
  const classEntries = generateTimetableEntries(cls.id);
  allEntries = [...allEntries, ...classEntries];
});

// Filter entries for the specific room
return allEntries.filter(entry => entry.roomId === roomId);
};

export {
  classLevels,
  classes,
  availableSubjects,
  teachers,
  rooms,
  availableLevels,
  generateTimetableEntries,
  getTeacherTimetable,
  getClassTimetable,
  getAllTimetableEntries,
  getRoomTimetable
};
