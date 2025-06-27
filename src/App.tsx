import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { useAuthInit } from './hooks/useAuthInit';
import Layout from './components/Layout/Layout';
import AdminLayout from './components/Admin/AdminLayout';
import FacultyLayout from './components/Faculty/FacultyLayout';
import StudentLayout from './components/Student/StudentLayout';
import ProtectedRoute from './components/Admin/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
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

function App() {
  // Initialize authentication state
  useAuthInit();

  return (
    <Router>
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
          <Route path="events" element={<AdminEvents />} />
          <Route path="notices" element={<Notices />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
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
          <Route path="courses" element={<div className="p-6">Faculty Courses Page</div>} />
          <Route path="students" element={<div className="p-6">Faculty Students Page</div>} />
          <Route path="events" element={<div className="p-6">Faculty Events Page</div>} />
          <Route path="notices" element={<div className="p-6">Faculty Notices Page</div>} />
          <Route path="grades" element={<div className="p-6">Faculty Grades Page</div>} />
          <Route path="office-hours" element={<div className="p-6">Faculty Office Hours Page</div>} />
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
          <Route path="courses" element={<div className="p-6">Student Courses Page</div>} />
          <Route path="grades" element={<div className="p-6">Student Grades Page</div>} />
          <Route path="events" element={<div className="p-6">Student Events Page</div>} />
          <Route path="notices" element={<div className="p-6">Student Notices Page</div>} />
          <Route path="calendar" element={<div className="p-6">Student Calendar Page</div>} />
          <Route path="services" element={<div className="p-6">Student Services Page</div>} />
          <Route path="programs" element={<div className="p-6">Student Programs Page</div>} />
        </Route>

        {/* Public routes */}
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
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