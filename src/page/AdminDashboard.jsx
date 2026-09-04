import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import AdminLayout from '../components/common/AdminLayout';
import { useAuth } from '../Context/AuthContext';
import api from '../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    courses: 0,
    instructors: 0,
    lectures: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const [coursesResponse, instructorsResponse, lecturesResponse] =
        await Promise.all([
          api.get('/courses'),
          api.get('/instructors'),
          api.get('/lectures'),
        ]);

      setStats({
        courses: coursesResponse.data?.courses?.length || 0,
        instructors: instructorsResponse.data?.instructors?.length || 0,
        lectures: lecturesResponse.data?.lectures?.length || 0,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Unable to load dashboard data'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const overviewCards = [
    { label: 'Total Courses', value: stats.courses },
    { label: 'Total Instructors', value: stats.instructors },
    { label: 'Scheduled Lectures', value: stats.lectures },
  ];

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-500">
            Welcome back, {user?.firstname}.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">Loading dashboard data...</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {overviewCards.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-500">
                    {item.label}
                  </p>
                  <p className="mt-3 text-3xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold">Quick Actions</h2>

              <div className="mt-5 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate('/admin/courses')}
                  className="rounded-lg bg-primary px-5 py-3 font-medium text-white hover:opacity-90"
                >
                  Manage Courses
                </button>

                <button
                  onClick={() => navigate('/admin/instructors')}
                  className="rounded-lg border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
                >
                  View Instructors
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;