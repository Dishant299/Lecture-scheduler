import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { useAuth } from "../Context/AuthContext";

const InstructorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLectures = async () => {
    try {
      const response = await api.get(
        "/lectures/my-lectures"
      );

      if (response.data.success) {
        setLectures(response.data.lectures);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch lectures"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLectures();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold">
              Lecture Scheduler
            </h1>

            <p className="text-sm text-gray-500">
              Instructor Panel
            </p>
          </div>

          <div className="flex items-center gap-4">

            <div className="hidden text-right sm:block">
              <p className="font-medium">
                {user?.firstname} {user?.lastname}
              </p>

              <p className="text-sm text-gray-500">
                {user?.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
            >
              Logout
            </button>

          </div>

        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            My Lectures
          </h2>

          <p className="mt-2 text-gray-500">
            View all lectures assigned to you.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            Loading lectures...
          </div>
        )}

        {/* Empty */}
        {!loading && lectures.length === 0 && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h3 className="text-lg font-semibold">
              No lectures assigned
            </h3>

            <p className="mt-2 text-gray-500">
              You currently have no scheduled lectures.
            </p>
          </div>
        )}

        {/* Lectures */}
        {!loading && lectures.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {lectures.map((lecture) => (
              <div
                key={lecture._id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >

                <img
                  src={
                    lecture.course?.image ||
                    "https://via.placeholder.com/600x300"
                  }
                  alt={lecture.course?.name}
                  className="h-44 w-full object-cover"
                />

                <div className="p-5">

                  <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                    {lecture.course?.level}
                  </span>

                  <h3 className="mt-3 text-xl font-bold">
                    {lecture.course?.name}
                  </h3>

                  <div className="mt-4 space-y-2">

                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Batch
                      </span>

                      <span className="font-medium">
                        {lecture.batchName}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-500">
                        Date
                      </span>

                      <span className="font-medium">
                        {lecture.lectureDate}
                      </span>
                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
};

export default InstructorDashboard;