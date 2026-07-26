import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Classes() {

  const [classes, setClasses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [formData, setFormData] = useState({
    class_name: "",
    course_id: "",
    teacher_id: "",
    schedule: ""
  });

  const fetchClasses = () => {
    axios
      .get("http://localhost:5000/classes")
      .then((response) => {
        setClasses(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchCourses = () => {
    axios
      .get("http://localhost:5000/courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchTeachers = () => {
    axios
      .get("http://localhost:5000/teachers")
      .then((response) => {
        setTeachers(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    fetchClasses();
    fetchCourses();
    fetchTeachers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setSelectedClass(null);
    setFormData({ class_name: "", course_id: "", teacher_id: "", schedule: "" });
    setShowModal(true);
  };

  const openEditModal = (cls) => {
    setSelectedClass(cls);
    setFormData({
      class_name: cls.class_name,
      course_id: cls.course_id || "",
      teacher_id: cls.teacher_id || "",
      schedule: cls.schedule || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
    setFormData({ class_name: "", course_id: "", teacher_id: "", schedule: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (selectedClass) {

        await axios.put(
          `http://localhost:5000/classes/${selectedClass.id}`,
          formData
        );

        alert("Class updated successfully");

      } else {

        await axios.post(
          "http://localhost:5000/classes",
          formData
        );

        alert("Class added successfully");
      }

      fetchClasses();
      closeModal();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save class");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(`http://localhost:5000/classes/${id}`);

      setClasses(classes.filter((cls) => cls.id !== id));

      alert("Class deleted successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to delete class");
    }
  };

  return (
    <div className="container">

      <div className="controls">
        <input
          type="text"
          placeholder="Search class..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-student-btn" onClick={openAddModal}>
        + Add Class
      </button>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Class Name</th>
              <th>Course</th>
              <th>Teacher</th>
              <th>Schedule</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {classes
              .filter((cls) =>
                cls.class_name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((cls) => (
                <tr key={cls.id}>
                  <td>{cls.id}</td>
                  <td>{cls.class_name}</td>
                  <td>{cls.course_code || "-"}</td>
                  <td>
                    {cls.teacher_first_name
                      ? `${cls.teacher_first_name} ${cls.teacher_last_name}`
                      : "-"}
                  </td>
                  <td>{cls.schedule}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => openEditModal(cls)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(cls.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">

            <div className="modal-header">
              <h3>{selectedClass ? "Edit Class" : "Add Class"}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            <form className="form-container" onSubmit={handleSubmit}>
              <div className="form-grid">
                <input
                  type="text"
                  name="class_name"
                  placeholder="Class Name (e.g. BSIT 2A - Web Dev)"
                  value={formData.class_name}
                  onChange={handleChange}
                />

                <select
                  name="course_id"
                  value={formData.course_id}
                  onChange={handleChange}
                >
                  <option value="">Select Course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.course_code} - {course.course_name}
                    </option>
                  ))}
                </select>

                <select
                  name="teacher_id"
                  value={formData.teacher_id}
                  onChange={handleChange}
                >
                  <option value="">Select Teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.first_name} {teacher.last_name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  name="schedule"
                  placeholder="Schedule (e.g. Mon 8:00 AM)"
                  value={formData.schedule}
                  onChange={handleChange}
                />
              </div>

              <button className="submit-btn" type="submit">
                {selectedClass ? "Update Class" : "Add Class"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Classes;