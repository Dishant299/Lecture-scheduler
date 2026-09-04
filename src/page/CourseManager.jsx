import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import api from "../services/api";
import AdminLayout from "../components/common/AdminLayout";

const CourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [batchName, setBatchName] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    level: "Beginner",
    description: "",
    image: "",
  });

  const [instructors, setInstructors] = useState([]);
  const [lectures, setLectures] = useState([]);

  const [scheduleData, setScheduleData] = useState({
        courseId: "",
        batchName: "",
        instructorId: "",
        lectureDate: "",
  });

  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduleLoading, setScheduleLoading] = useState(false);

    const fetchInstructors = async () => {
    try {
        const response = await api.get("/instructors");

        if (response.data.success) {
        setInstructors(response.data.instructors);
        }
    } catch (error) {
        toast.error("Unable to fetch instructors");
    }
    };

    const fetchLectures = async () => {
    try {
        const response = await api.get("/lectures");

        if (response.data.success) {
        setLectures(response.data.lectures);
        }
    } catch (error) {
        toast.error("Unable to fetch lectures");
    }
    };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/courses");

      if (response.data.success) {
        setCourses(response.data.courses);
      }
    } catch (error) {
      toast.error("Unable to fetch courses");
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
    fetchLectures();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      const response = await api.post(
        "/courses",
        formData
      );

      if (response.data.success) {
        toast.success("Course created");

        setFormData({
          name: "",
          level: "Beginner",
          description: "",
          image: "",
        });

        fetchCourses();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to create course"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddBatch = async () => {
  if (!batchName.trim()) {
    toast.error("Enter batch name");
    return;
  }

  try {
    const response = await api.post(
      `/courses/${selectedCourse._id}/batches`,
      { name: batchName }
    );

    if (response.data.success) {
      toast.success("Batch added");

      setBatchName("");
      setSelectedCourse(null);

      fetchCourses();
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to add batch"
    );
  }
};

const handleScheduleChange = (event) => {
  const { name, value } = event.target;

  setScheduleData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleScheduleLecture = async (event) => {
  event.preventDefault();

  const {
    courseId,
    batchName,
    instructorId,
    lectureDate,
  } = scheduleData;

  if (
    !courseId ||
    !batchName ||
    !instructorId ||
    !lectureDate
  ) {
    toast.error("Please fill all scheduling fields");
    return;
  }

  try {
    setScheduleLoading(true);

    const response = await api.post(
      "/lectures",
      scheduleData
    );

    if (response.data.success) {
      toast.success("Lecture scheduled successfully");

      setScheduleData({
        courseId: "",
        batchName: "",
        instructorId: "",
        lectureDate: "",
      });

      setShowSchedule(false);

      fetchLectures();
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
        "Unable to schedule lecture"
    );
  } finally {
    setScheduleLoading(false);
  }
};

  return (
    <AdminLayout>
      <div className="p-6 md:p-8">

        <h1 className="text-3xl font-bold">
          Courses
        </h1>

        <p className="mt-2 text-gray-500">
          Create and manage courses.
        </p>

        {/* Create Course */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm">

          <h2 className="text-xl font-semibold">
            Create Course
          </h2>

          <form
            onSubmit={handleSubmit}
            className="mt-6 grid gap-5 md:grid-cols-2"
          >

            <div>
              <label className="mb-2 block text-sm font-medium">
                Course Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Full Stack Development"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Level
              </label>

              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-3"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Course description"
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium">
                Image URL
              </label>

              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-primary"
              />
            </div>

            <div className="md:col-span-2">
              <button
                disabled={loading}
                className="rounded-lg bg-primary px-6 py-3 font-semibold text-white disabled:opacity-60"
              >
                {loading
                  ? "Creating..."
                  : "Create Course"}
              </button>
            </div>

          </form>
        </div>

        <div className="mt-10">

        <h2 className="mb-4 text-xl font-semibold">
            Scheduled Lectures
        </h2>

        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">

            <table className="w-full">

                <thead className="border-b bg-gray-50">
                <tr>
                    <th className="px-6 py-4 text-left">
                    Course
                    </th>

                    <th className="px-6 py-4 text-left">
                    Batch
                    </th>

                    <th className="px-6 py-4 text-left">
                    Instructor
                    </th>

                    <th className="px-6 py-4 text-left">
                    Date
                    </th>
                </tr>
                </thead>

                <tbody className="divide-y">

                {lectures.map((lecture) => (
                    <tr key={lecture._id}>

                    <td className="px-6 py-4 font-medium">
                        {lecture.course?.name}
                    </td>

                    <td className="px-6 py-4">
                        {lecture.batchName}
                    </td>

                    <td className="px-6 py-4">
                        {lecture.instructor?.firstname}{" "}
                        {lecture.instructor?.lastname}
                    </td>

                    <td className="px-6 py-4">
                        {lecture.lectureDate}
                    </td>

                    </tr>
                ))}

                </tbody>

            </table>

            </div>
        </div>
        </div>

        {/* Course List */}
        <div className="mt-8">

          <h2 className="mb-4 text-xl font-semibold">
            Existing Courses
          </h2>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {courses.map((course) => (
              <div
                key={course._id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                <img
                  src={course.image}
                  alt={course.name}
                  className="h-40 w-full object-cover"
                />

                <div className="p-5">
                  <span className="text-sm text-primary">
                    {course.level}
                  </span>

                  <h3 className="mt-1 text-lg font-bold">
                    {course.name}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    {course.description}
                  </p>

                  <p className="mt-4 text-sm font-medium">
                    Batches: {course.batches.length}
                  </p>

                  <button
                    onClick={() => setSelectedCourse(course)}
                    className="mt-4 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-orange-50"
                    >
                    Add Batch
                  </button>

                  <button
                        onClick={() => {
                            setScheduleData({
                            courseId: course._id,
                            batchName:
                                course.batches.length > 0
                                ? course.batches[0].name
                                : "",
                            instructorId: "",
                            lectureDate: "",
                            });

                            setShowSchedule(true);
                        }}
                        className="ml-2 mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white"
                        >
                        Schedule Lecture
                   </button>
                </div>
              </div>
            ))}

          </div>

        </div>

      </div>
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-xl bg-white p-6">

            <h2 className="text-xl font-bold">
                Add Batch
            </h2>

            <p className="mt-1 text-sm text-gray-500">
                {selectedCourse.name}
            </p>

            <input
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g. Batch A"
                className="mt-5 w-full rounded-lg border px-4 py-3 outline-none focus:border-primary"
            />

            <div className="mt-5 flex justify-end gap-3">

                <button
                onClick={() => {
                    setSelectedCourse(null);
                    setBatchName("");
                }}
                className="rounded-lg border px-4 py-2"
                >
                Cancel
                </button>

                <button
                onClick={handleAddBatch}
                className="rounded-lg bg-primary px-4 py-2 text-white"
                >
                Add Batch
                </button>

            </div>
            </div>
        </div>
        )}

        {showSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6">

            <h2 className="text-2xl font-bold">
                Schedule Lecture
            </h2>

            <form
                onSubmit={handleScheduleLecture}
                className="mt-6 space-y-5"
            >

                {/* Batch */}
                <div>
                <label className="mb-2 block text-sm font-medium">
                    Batch
                </label>

                <select
                    name="batchName"
                    value={scheduleData.batchName}
                    onChange={handleScheduleChange}
                    className="w-full rounded-lg border px-4 py-3"
                >
                    <option value="">
                    Select Batch
                    </option>

                    {courses
                    .find(
                        (course) =>
                        course._id === scheduleData.courseId
                    )
                    ?.batches.map((batch, index) => (
                        <option
                        key={index}
                        value={batch.name}
                        >
                        {batch.name}
                        </option>
                    ))}
                </select>
                </div>

                {/* Instructor */}
                <div>
                <label className="mb-2 block text-sm font-medium">
                    Instructor
                </label>

                <select
                    name="instructorId"
                    value={scheduleData.instructorId}
                    onChange={handleScheduleChange}
                    className="w-full rounded-lg border px-4 py-3"
                >
                    <option value="">
                    Select Instructor
                    </option>

                    {instructors.map((instructor) => (
                    <option
                        key={instructor._id}
                        value={instructor._id}
                    >
                        {instructor.firstname}{" "}
                        {instructor.lastname}
                    </option>
                    ))}
                </select>
                </div>

                {/* Date */}
                <div>
                <label className="mb-2 block text-sm font-medium">
                    Lecture Date
                </label>

                <input
                    type="date"
                    name="lectureDate"
                    value={scheduleData.lectureDate}
                    onChange={handleScheduleChange}
                    className="w-full rounded-lg border px-4 py-3"
                />
                </div>

                <div className="flex justify-end gap-3">

                <button
                    type="button"
                    onClick={() => setShowSchedule(false)}
                    className="rounded-lg border px-5 py-2"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={scheduleLoading}
                    className="rounded-lg bg-primary px-5 py-2 font-semibold text-white disabled:opacity-60"
                >
                    {scheduleLoading
                    ? "Scheduling..."
                    : "Schedule Lecture"}
                </button>

                </div>

            </form>
            </div>
        </div>
        )}
    </AdminLayout>
  );
};

export default CourseManager;