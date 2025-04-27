// Mock data for class levels
const classLevels = [
  { id: 'cp', name: 'CP' },
  { id: 'ce1', name: 'CE1' },
  { id: 'ce2', name: 'CE2' },
  { id: 'cm1', name: 'CM1' },
  { id: 'cm2', name: 'CM2' },
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
];

// Available subjects
const availableSubjects = [
  'Français',
  'Mathématiques',
  'Sciences',
  'Histoire-Géographie',
  'Anglais',
  'Sport',
  'Arts Plastiques',
  'Musique',
];

// Mock data for teachers with multiple subjects
const teachers = [
  { 
    id: 't1', 
    name: 'Sophie Martin', 
    email: 'sophie.martin@school.com', 
    subjects: ['Français', 'Histoire-Géographie'],
    image: 'https://images.pexels.com/photos/3771807/pexels-photo-3771807.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 't2', 
    name: 'Thomas Dubois', 
    email: 'thomas.dubois@school.com', 
    subjects: ['Mathématiques', 'Sciences'],
    image: 'https://images.pexels.com/photos/8617943/pexels-photo-8617943.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 't3', 
    name: 'Claire Leroy', 
    email: 'claire.leroy@school.com', 
    subjects: ['Sciences', 'Mathématiques'],
    image: 'https://images.pexels.com/photos/3767392/pexels-photo-3767392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 't4', 
    name: 'Pierre Moreau', 
    email: 'pierre.moreau@school.com', 
    subjects: ['Histoire-Géographie', 'Français'],
    image: 'https://images.pexels.com/photos/8422405/pexels-photo-8422405.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 't5', 
    name: 'Marie Bernard', 
    email: 'marie.bernard@school.com', 
    subjects: ['Anglais', 'Français'],
    image: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 't6', 
    name: 'Antoine Petit', 
    email: 'antoine.petit@school.com', 
    subjects: ['Sport', 'Sciences'],
    image: 'https://images.pexels.com/photos/6325984/pexels-photo-6325984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 't7', 
    name: 'Émilie Richard', 
    email: 'emilie.richard@school.com', 
    subjects: ['Arts Plastiques', 'Musique'],
    image: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  { 
    id: 't8', 
    name: 'Julien Robert', 
    email: 'julien.robert@school.com', 
    subjects: ['Musique', 'Arts Plastiques'],
    image: 'https://images.pexels.com/photos/8535214/pexels-photo-8535214.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
];

// Mock data for rooms
const rooms = [
  { id: 'r1', name: 'Salle 101', capacity: 30, building: 'A', floor: 1 },
  { id: 'r2', name: 'Salle 102', capacity: 30, building: 'A', floor: 1 },
  { id: 'r3', name: 'Salle 103', capacity: 30, building: 'A', floor: 1 },
  { id: 'r4', name: 'Salle 201', capacity: 30, building: 'A', floor: 2 },
  { id: 'r5', name: 'Salle 202', capacity: 30, building: 'A', floor: 2 },
  { id: 'r6', name: 'Salle 203', capacity: 30, building: 'A', floor: 2 },
  { id: 'r7', name: 'Gymnase', capacity: 60, building: 'B', floor: 0 },
  { id: 'r8', name: 'Salle d\'Arts', capacity: 30, building: 'B', floor: 1 },
  { id: 'r9', name: 'Salle de Musique', capacity: 30, building: 'B', floor: 1 },
  { id: 'r10', name: 'Bibliothèque', capacity: 45, building: 'C', floor: 1 },
];

// Function to generate timetable entries
const generateTimetableEntries = (classId) => {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  const timeslots = [
    { start: '08:30', end: '10:00' },
    { start: '10:15', end: '11:45' },
    { start: '13:30', end: '15:00' },
    { start: '15:15', end: '16:45' },
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
      } else if (subject === 'Musique') {
        room = rooms.find(r => r.name === 'Salle de Musique') || rooms[Math.floor(Math.random() * rooms.length)];
      } else {
        // For other subjects, use a standard classroom
        const standardRooms = rooms.filter(r => !['Gymnase', 'Salle d\'Arts', 'Salle de Musique', 'Bibliothèque'].includes(r.name));
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
  generateTimetableEntries,
  getTeacherTimetable,
  getClassTimetable,
  getAllTimetableEntries,
  getRoomTimetable
};
