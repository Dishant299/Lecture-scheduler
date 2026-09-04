import { Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './page/Login';
import AdminDashboard from './page/AdminDashboard';
import InstructorDashboard from './page/InstructorDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import InstructorList from "./page/InstructorList";
import CourseManager from './page/CourseManager';

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />}/>

        <Route path="/login" element={<Login />}/>

        <Route path="/admin" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/instructors" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <InstructorList />
            </ProtectedRoute>
          }
        />

        <Route path="/instructor" element={
            <ProtectedRoute
              allowedRoles={["Instructor"]}
            >
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/admin/courses" element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <CourseManager />
            </ProtectedRoute>
          }
        />

      </Routes>
    </>
  );
}

export default App;