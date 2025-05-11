import { Routes, Route } from 'react-router-dom';  // Ajoute BrowserRouter !!
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthProvider';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPassword from './pages/ForgotPassword';
import AboutPage from './pages/AboutPage';
import TimetablePage from './pages/TimetablePage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherProfile from './pages/teacher/TeacherProfile';
import TeacherTimetable from './pages/teacher/TeacherTimetable';
import TeacherAbsence from './pages/teacher/TeacherAbsence';
import TeacherRéservation from './pages/teacher/TeacherRéservation'
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminTimetable from './pages/admin/AdminTimetable';
import AdminTeachers from './pages/admin/AdminTeachers';
import AdminClasses from './pages/admin/AdminClasses';
import AdminRooms from './pages/admin/AdminRooms';
import ProtectedRoute from './Components/auth/ProtectedRoute';
import EditTimetable from './pages/admin/EditTimetable';

function App() {
  return (
    <AuthProvider>

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/timetable" element={<TimetablePage />} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={
          // <ProtectedRoute role="teacher">

          // </ProtectedRoute>
          <TeacherDashboard />
        } />
        <Route path="/teacher/profile" element={
          // <ProtectedRoute role="teacher">
          <TeacherProfile />
          // </ProtectedRoute>
        } />
        <Route path="/teacher/timetable" element={
          // <ProtectedRoute role="teacher">
          <TeacherTimetable />
          // </ProtectedRoute>
        } />
        <Route path="/teacher/absence" element={
          // <ProtectedRoute role="teacher">
          <TeacherAbsence />
          // </ProtectedRoute>
        } />
        <Route path="/teacher/reservation" element={
          // <ProtectedRoute role="teacher">
          <TeacherRéservation />
          // </ProtectedRoute>
        } />
        {/* Admin Routes */}
        <Route path="/admin" element={
          // <ProtectedRoute role="admin">
          // </ProtectedRoute>
          <AdminDashboard />
        } />
        <Route path="/admin/timetable" element={
          // <ProtectedRoute role="admin">
          <AdminTimetable />
          // </ProtectedRoute>
        } />
        <Route path="/admin/timetablemanuelle" element={
          // <ProtectedRoute role="admin">
          <EditTimetable />
          // </ProtectedRoute> 
        } />
        <Route path="/admin/teachers" element={
          // <ProtectedRoute role="admin">
          <AdminTeachers />
          // </ProtectedRoute>
        } />
        <Route path="/admin/classes" element={
          // <ProtectedRoute role="admin">
          <AdminClasses />
          // </ProtectedRoute>
        } />
        <Route path="/admin/rooms" element={
          // <ProtectedRoute role="admin">
          <AdminRooms />
          // </ProtectedRoute>
        } />
      </Routes>

    </AuthProvider>
  );
}

export default App;
