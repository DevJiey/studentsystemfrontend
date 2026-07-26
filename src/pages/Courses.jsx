import { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function Courses() {

  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    course_code: "",
    course_name: "",
    description: ""
  });

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

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddModal = () => {
    setSelectedCourse(null);
    setFormData({ course_code: "", course_name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setSelectedCourse(course);
    setFormData({
      course_code: course.course_code,
      course_name: course.course_name,
      description: course.description || ""
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
    setFormData({ course_code: "", course_name: "", description: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (selectedCourse) {

        const response = await axios.put(
          `http://localhost:5000/courses/${selectedCourse.id}`,
          formData
        );

        setCourses(
          courses.map((course) =>
            course.id === selectedCourse.id ? response.data : course
          )
        );

        alert("Course updated successfully");

      } else {

        const response = await axios.post(
          "http://localhost:5000/courses",
          formData
        );

        setCourses([...courses, response.data]);

        alert("Course added successfully");
      }

      closeModal();

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to save course");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      await axios.delete(`http://localhost:5000/courses/${id}`);

      setCourses(courses.filter((course) => course.id !== id));

      alert("Course deleted successfully");

    } catch (error) {
      console.error(error);
      alert("Failed to delete course");
    }
  };

  return (
    <div className="container">

      <div className="controls">
        <input
          type="text"
          placeholder="Search course..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <button className="add-student-btn" onClick={openAddModal}>
        + Add Course
      </button>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses
              .filter((course) =>
                course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((course) => (
                <tr key={course.id}>
                  <td>{course.id}</td>
                  <td>{course.course_code}</td>
                  <td>{course.course_name}</td>
                  <td>{course.description}</td>
                  <td>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => openEditModal(course)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(course.id)}
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
              <h3>{selectedCourse ? "Edit Course" : "Add Course"}</h3>
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
                  name="course_code"
                  placeholder="Course Code (e.g. BSIT)"
                  value={formData.course_code}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="course_name"
                  placeholder="Course Name"
                  value={formData.course_name}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="description"
                  placeholder="Description (optional)"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <button className="submit-btn" type="submit">
                {selectedCourse ? "Update Course" : "Add Course"}
              </button>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Courses;