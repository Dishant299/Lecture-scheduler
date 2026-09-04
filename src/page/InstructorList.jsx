import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";
import AdminLayout from "../components/common/AdminLayout";

const InstructorList = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInstructors = async () => {
    try {
      setLoading(true);

      const response = await api.get("/instructors");

      if (response.data.success) {
        setInstructors(response.data.instructors);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to fetch instructors"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Instructors
          </h1>

          <p className="mt-2 text-gray-500">
            View all instructors available for lecture assignment.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            Loading instructors...
          </div>
        ) : instructors.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-500">
              No instructors found.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">

            <div className="overflow-x-auto">
              <table className="w-full">

                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Name
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold">
                      Role
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">

                  {instructors.map((instructor) => (
                    <tr
                      key={instructor._id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-white">
                            {instructor.firstname?.charAt(0)}
                          </div>

                          <span className="font-medium">
                            {instructor.firstname}{" "}
                            {instructor.lastname}
                          </span>

                        </div>
                      </td>

                      <td className="px-6 py-4 text-gray-600">
                        {instructor.email}
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                          Instructor
                        </span>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>

          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default InstructorList;