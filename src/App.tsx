import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthInit } from './hooks/useAuthInit';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import FacultyLayout from './components/Faculty/FacultyLayout';
import StudentLayout from './components/Student/StudentLayout';
import { ProtectedRoute } from './components/Admin/Shared';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPasswordRequest from './pages/ResetPasswordRequest';
import Events from './pages/Events';
import Noticeboard from './pages/Noticeboard';
import Programs from './pages/Programs';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard/Dashboard';
import AdminDashboard from './pages/Admin/Dashboard';
import Users from './pages/Admin/Users';
import AdminEvents from './pages/Admin/Events';
import Notices from './pages/Admin/Notices';
import AdminPrograms from './pages/Admin/Programs';
import Analytics from './pages/Admin/Analytics';
import Settings from './pages/Admin/Settings';
import AdminBlog from './pages/Admin/Blog';
import StudentProfile from './pages/Student/Profile';
import StudentCourses from './pages/Student/Courses';
import StudentGrades from './pages/Student/Grades';
import StudentEvents from './pages/Student/Events';
import StudentNotices from './pages/Student/Notices';
import StudentCalendar from './pages/Student/Calendar';
import StudentPrograms from './pages/Student/Programs';
import Students from './pages/Faculty/Students';
import FacultyEvents from './pages/Faculty/Events';
import FacultyNotices from './pages/Faculty/Notices';
import Grades from './pages/Faculty/Grades';
import OfficeHours from './pages/Faculty/OfficeHours';
import FacultyBlog from './pages/Faculty/Blog';
import Departments from './pages/Admin/Departments';
import AdminCourses from './pages/Admin/Courses';
import FacultyCourses from './pages/Faculty/Courses';
import StudentMockDemo from './pages/StudentMockDemo';
import ProgramApplicationsList from './components/Admin/ProgramApplications/ProgramApplicationsList';


function App() {
  // Initialize authentication state
  useAuthInit();

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#000000',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#F59E0B',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Dashboard route - role-based access */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Admin panel routes with role-based protection */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<Departments />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="notices" element={<Notices />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="program-applications" element={<ProgramApplicationsList />} />
        </Route>

        {/* Faculty routes with role-based protection */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute allowedRoles={['faculty']}>
              <FacultyLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<FacultyCourses />} />
          <Route path="students" element={<Students />} />
          <Route path="events" element={<FacultyEvents />} />
          <Route path="notices" element={<FacultyNotices />} />
          <Route path="grades" element={<Grades />} />
          <Route path="office-hours" element={<OfficeHours />} />
          <Route path="blog" element={<FacultyBlog />} />
        </Route>

        {/* Student routes with role-based protection */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="grades" element={<StudentGrades />} />
          <Route path="events" element={<StudentEvents />} />
          <Route path="notices" element={<StudentNotices />} />
          <Route path="calendar" element={<StudentCalendar />} />
          <Route path="programs" element={<StudentPrograms />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="mock-students" element={<StudentMockDemo />} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="reset-password-request" element={<ResetPasswordRequest />} />
          <Route path="events" element={<Events />} />
          <Route path="noticeboard" element={<Noticeboard />} />
          <Route path="programs" element={<Programs />} />
          <Route path="about" element={<About />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="blog" element={<Blog />} />
          <Route path="contact" element={<Contact />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;